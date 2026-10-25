package com.jainam.service;

import com.jainam.dto.ProductDTO;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.contentstream.PDFGraphicsStreamEngine;
import org.apache.pdfbox.cos.COSName;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.graphics.image.PDImage;
import org.apache.pdfbox.rendering.ImageType;
import org.apache.pdfbox.rendering.PDFRenderer;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.pdfbox.text.TextPosition;
import org.springframework.stereotype.Component;

import javax.imageio.ImageIO;
import java.awt.geom.Point2D;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/** Layout-aware reader for the illustrated Jainam hose catalogue format. */
@Component
public class ProductCatalogParser {
    private static final int MAX_PRODUCTS = 1500;
    private static final int MAX_IMAGE_BYTES = 1_500_000;
    private static final Pattern JNM = Pattern.compile("(?i)J\\s*N\\s*M\\s*((?:\\d(?:\\s*\\d){2,5}(?:\\s+[A-Z]{1,6})?)|(?:[A-Z]{1,5}(?:\\s+[A-Z]{1,5})?\\s+\\d{1,5}(?:\\s+[A-Z]{1,6})?))");
    private static final Pattern DIMENSION_PAIR = Pattern.compile("(?i)\\d+(?:\\.\\d+)?\\s*(?:mm|cm|in(?:ch(?:es)?)?|\\\"|”|″)\\s*[xX]\\s*\\d+(?:\\.\\d+)?\\s*(?:mm|cm|in(?:ch(?:es)?)?|\\\"|”|″)");
    private static final Pattern MEASURE = Pattern.compile("(?i)(?:\\([^)]*(?:\\d+(?:\\.\\d+)?\\s*(?:\\\"|”|″|in(?:ch(?:es)?)?|mm|cm|ft|feet)|\\d+\\s*to\\s*\\d+|LONG)[^)]*\\)|\\d+(?:\\.\\d+)?\\s*(?:\\\"|”|″|mm|cm|ft|feet))\\s*$");
    private static final Set<String> VALID_CATEGORIES = Set.of(
            "AIR COMP HOSES", "POWER STEERING HOSES", "BRAKE HOSES", "FUEL HOSES",
            "RADIATOR HOSES", "CLUTCH HOSES", "AC HOSES", "OIL COOLER HOSES",
            "HYDRAULIC HOSES", "HOSES", "AIR COMPRESSOR & POWER STEERING HOSES FOR BS3 & BS4",
            "AIR COMPRESSOR & POWER STEARING HOSES", "PTFE, TILT CABIN, CLUTCH & AIR COMP. HOSES",
            "TEFLON HOSES (TURBO HOSES)", "TEFLON HOSES", "POWER STEERING, AIR COMP. & BRAKE HOSES",
            "POWER STEERING & AIR COMP. HOSES", "TILT CABIN HOSES", "NYLON PIPE REPAIR NUT KITS & UNIONS",
            "BRASS REPAIR KITS", "EICHER SECTION", "GREES GUN PIPE", "BHARAT BENZ CLUTCH HOSE",
            "6MM NYLON PIPE", "15MM NYLON PIPE", "12MM NYLON PIPE", "UNIONS, BANJO TEE & P.U. PIPES",
            "P. U. PIPE", "COOLANT / AIR HOSE PIPES", "P. U. FITTINGS & JOINT CONNECTORS",
            "GEAR COVER, RED SILICON HOSE & NYLON VOSS FITTINGS", "NYLON REPAIR TUBE ( JUGAD PIPE )",
            "FUEL LINES (DIESEL PIPES)", "NYLON PIPE (BSB)", "NYLON PIPE W/SPRING (BSB)",
            "R6(RUBBER) HOSE (BSB)", "WIRE BRAIDED(FLEXIBLE) HOSE (BSB)",
            "PVC BRAIDED(TRANSPARENT) HOSE (BSB)", "HORN PIPES", "TURBO PIPES"
    );

    public List<ProductDTO> parse(byte[] pdfBytes) throws IOException {
        List<ProductDTO> products = new ArrayList<>();
        try (PDDocument document = Loader.loadPDF(pdfBytes)) {
            PDFRenderer renderer = new PDFRenderer(document);
            for (int pageIndex = 0; pageIndex < document.getNumberOfPages() && products.size() < MAX_PRODUCTS; pageIndex++) {
                PDPage page = document.getPage(pageIndex);
                double pageHeight = page.getMediaBox().getHeight();
                PageText text = readText(document, pageIndex + 1, pageHeight);
                List<ImageRegion> images = new ImageLocator(page).locate();
                List<Caption> captions = findCaptions(text);
                associateImages(captions, images);
                BufferedImage rendered = renderer.renderImageWithDPI(pageIndex, 96, ImageType.RGB);
                for (Caption caption : captions) {
                    if (products.size() >= MAX_PRODUCTS) break;
                    ProductDTO dto = new ProductDTO();
                    dto.setName(caption.name);
                    dto.setProductCode(caption.code);
                    dto.setSize(caption.size);
                    dto.setCategory(caption.category);
                    dto.setDescription(caption.sourceLabel);
                    dto.setSourceLabel(caption.sourceLabel);
                    dto.setSourcePage(pageIndex + 1);
                    dto.setPrice(null);
                    dto.setActive(true);
                    dto.setNeedsReview(true);
                    dto.setReviewConfirmed(false);
                    dto.setReviewReason(caption.reviewReason);
                    // Even a non-unique spatial candidate is useful in the review UI. It is never auto-approved.
                    if (caption.image != null) dto.setExtractedImageData(caption.image.dataUrl);
                    dto.setSourceCropData(makeSourceCrop(rendered, caption, page.getMediaBox()));
                    products.add(dto);
                }
                rendered.flush();
            }
        }
        return products;
    }

    private PageText readText(PDDocument doc, int pageNumber, double pageHeight) throws IOException {
        PageText page = new PageText();
        PositionedTextStripper stripper = new PositionedTextStripper(page, pageHeight);
        stripper.setStartPage(pageNumber);
        stripper.setEndPage(pageNumber);
        stripper.getText(doc);
        page.reconstructObliqueCaptions();
        return page;
    }

    private List<Caption> findCaptions(PageText page) {
        List<Caption> out = new ArrayList<>();
        Set<String> seen = new HashSet<>();
        for (TextRun run : page.runs) {
            String raw = normalize(run.text);
            Matcher matcher = JNM.matcher(raw);
            if (!matcher.find()) continue;
            String codePart = matcher.group(1).replaceAll("\\s+", " ").trim()
                    .replaceAll("(?<=\\d)\\s+(?=\\d)", "");
            Matcher numericCode = Pattern.compile("^(\\d+)").matcher(codePart);
            boolean incompleteNumericCode = numericCode.find() && numericCode.group(1).length() < 4
                    && !codePart.substring(numericCode.end()).matches("\\s+[A-Z]{1,6}");
            if (incompleteNumericCode) {
                Caption uncertain = new Caption();
                uncertain.sourceLabel = raw;
                uncertain.name = "";
                uncertain.code = "";
                uncertain.x = run.centerX;
                uncertain.centerY = run.centerY;
                uncertain.box = run.box;
                uncertain.incompleteLabel = true;
                uncertain.reviewReason = "The PDF text layer returned an incomplete JNM code. Transcribe it from the source crop; the partial value is not treated as a product code.";
                out.add(uncertain);
                continue;
            }
            String after = raw.substring(matcher.end()).trim();
            String code = "JNM " + codePart;
            String size = null;
            String variant = after;
            Matcher pairMatcher = DIMENSION_PAIR.matcher(variant);
            if (pairMatcher.find()) {
                size = pairMatcher.group().trim();
                variant = (variant.substring(0, pairMatcher.start()) + " " + variant.substring(pairMatcher.end()))
                        .replaceAll("^[\\s\\-–:]+", "").replaceAll("[\\s\\-–:]+$", "").trim();
            } else {
                Matcher sizeMatcher = MEASURE.matcher(variant);
                if (sizeMatcher.find()) {
                    size = sizeMatcher.group().trim();
                    variant = variant.substring(0, sizeMatcher.start()).trim();
                }
            }
            String name = code + (variant.isEmpty() ? "" : " " + variant);
            String sourceLabel = raw;
            String key = code.toLowerCase(Locale.ROOT) + "|" + Objects.toString(size, "").toLowerCase(Locale.ROOT);
            if (name.isBlank() || !seen.add(key)) continue;
            Caption c = new Caption();
            c.name = name;
            c.code = code;
            c.size = size;
            c.sourceLabel = sourceLabel;
            c.x = run.centerX;
            c.centerY = run.centerY;
            c.box = run.box;
            c.reviewReason = run.oblique
                    ? "Caption reconstructed from rotated text fragments; verify manually against the source crop."
                    : "Verify the printed caption, dimensions and image against the source-page crop before approving.";
            out.add(c);
        }
        // Only literal observed section headers are categories. A single section heading applies to the page;
        // pages with multiple section headers are resolved by vertical page position.
        Set<String> pageCategories = new LinkedHashSet<>();
        for (TextRun run : page.runs) {
            String heading = validCategory(run.text);
            if (heading != null) pageCategories.add(heading);
        }
        for (Caption c : out) {
            if (pageCategories.size() == 1) { c.category = pageCategories.iterator().next(); continue; }
            double best = Double.MAX_VALUE;
            for (TextRun run : page.runs) {
                String heading = validCategory(run.text);
                if (heading == null) continue;
                // Section banners apply forward until the next banner. Do not select a closer later section
                // or inherit a distant heading across an intervening layout block.
                if (run.centerY > c.centerY) continue;
                double distance = c.centerY - run.centerY + 0.25 * Math.abs(c.x - run.centerX);
                if (distance < best) { best = distance; c.category = heading; }
            }
            if (best > 250) c.category = null;
        }
        return out;
    }

    private void associateImages(List<Caption> captions, List<ImageRegion> images) {
        Map<ImageRegion, Integer> uses = new IdentityHashMap<>();
        for (Caption c : captions) {
            List<ImageScore> scores = new ArrayList<>();
            for (ImageRegion image : images) {
                double distance = image.box.distance(c.x, c.centerY);
                if (distance <= 150) scores.add(new ImageScore(image, distance));
            }
            scores.sort(Comparator.comparingDouble(s -> s.distance));
            if (scores.isEmpty()) {
                if (c.incompleteLabel) c.reviewReason += " No separate nearby image object was detected; assign one manually.";
                else c.reviewReason = "No separate nearby image object was detected; inspect the source crop and assign an image manually.";
                continue;
            }
            c.image = scores.get(0).image;
            c.imageUnique = scores.size() == 1 || scores.get(1).distance - scores.get(0).distance > 22;
            uses.merge(c.image, 1, Integer::sum);
        }
        for (Caption c : captions) {
            if (c.image != null && uses.getOrDefault(c.image, 0) > 1) {
                c.imageUnique = false;
                if (!c.incompleteLabel) c.reviewReason = "The nearest PDF image region is shared by multiple captions; verify or reassign manually.";
            } else if (c.image != null && !c.imageUnique) {
                if (!c.incompleteLabel) c.reviewReason = "Multiple image regions are similarly close; verify or reassign manually.";
            }
        }
    }

    private String makeSourceCrop(BufferedImage page, Caption caption, PDRectangle mediaBox) throws IOException {
        double scale = page.getWidth() / mediaBox.getWidth();
        int width = Math.min(page.getWidth(), (int) Math.round(230 * scale));
        int height = Math.min(page.getHeight(), (int) Math.round(180 * scale));
        int x = Math.max(0, Math.min(page.getWidth() - width, (int) Math.round(caption.x * scale - width / 2.0)));
        int y = Math.max(0, Math.min(page.getHeight() - height, (int) Math.round(caption.centerY * scale - height / 2.0)));
        BufferedImage crop = page.getSubimage(x, y, width, height);
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        ImageIO.write(crop, "jpg", out);
        crop.flush();
        if (out.size() > MAX_IMAGE_BYTES) return null;
        return "data:image/jpeg;base64," + Base64.getEncoder().encodeToString(out.toByteArray());
    }

    private String encodeImage(PDImage image) throws IOException {
        BufferedImage buffered = image.getImage();
        if (buffered == null || buffered.getWidth() < 32 || buffered.getHeight() < 32) return null;
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        ImageIO.write(buffered, "jpg", out);
        if (out.size() > MAX_IMAGE_BYTES) return null;
        return "data:image/jpeg;base64," + Base64.getEncoder().encodeToString(out.toByteArray());
    }

    private String validCategory(String line) {
        String cleaned = normalize(line).toUpperCase(Locale.ROOT).replaceAll("\\s+", " ").trim();
        return VALID_CATEGORIES.contains(cleaned) ? cleaned : null;
    }

    private String normalize(String value) {
        return value == null ? "" : value.replace('\u00a0', ' ').replaceAll("\\s+", " ").trim();
    }

    private static final class PageText {
        final List<TextRun> runs = new ArrayList<>();
        void reconstructObliqueCaptions() {
            List<TextRun> additions = new ArrayList<>();
            for (TextRun seed : runs) {
                if (seed.text == null || !seed.text.toUpperCase(Locale.ROOT).contains("JN") || seed.text.toUpperCase(Locale.ROOT).contains("JNM")) continue;
                if (Math.abs(seed.direction - 270) > 3) continue;
                // The first page's angled caption is emitted as separate text runs. Join only runs on its
                // measured oblique baseline; connector callouts have a different angle and never qualify as JNM.
                double ux = Math.sqrt(0.5), uy = Math.sqrt(0.5);
                List<TextRun> line = new ArrayList<>();
                for (TextRun candidate : runs) {
                    if (Math.abs(candidate.direction - seed.direction) > 3) continue;
                    double dx = candidate.centerX - seed.centerX, dy = candidate.centerY - seed.centerY;
                    double along = dx * ux + dy * uy;
                    double across = Math.abs(-dx * uy + dy * ux);
                    if (along >= -3 && along <= 185 && across <= 20) line.add(candidate);
                }
                if (line.size() < 3) continue;
                line.sort(Comparator.comparingDouble(r -> r.centerX * ux + r.centerY * uy));
                StringBuilder joined = new StringBuilder();
                double last = Double.NaN;
                for (TextRun part : line) {
                    double start = part.minX * ux + part.minY * uy;
                    if (joined.length() > 0 && start - last > 2.4) joined.append(' ');
                    joined.append(part.text);
                    last = part.maxX * ux + part.maxY * uy;
                }
                String raw = joined.toString().replaceAll("\\s+", " ").trim();
                if (JNM.matcher(raw).find()) {
                    TextRun rebuilt = new TextRun(raw, seed.box, seed.direction, true);
                    rebuilt.centerX = seed.centerX;
                    rebuilt.centerY = seed.centerY;
                    additions.add(rebuilt);
                }
            }
            runs.addAll(additions);
        }
    }

    private static final class TextRun {
        final String text;
        final Rect box;
        final double minX, minY, maxX, maxY, direction;
        double centerX, centerY;
        final boolean oblique;
        TextRun(String text, Rect box, double direction, boolean oblique) {
            this.text=text; this.box=box; this.minX=box.x0; this.minY=box.y0; this.maxX=box.x1; this.maxY=box.y1;
            this.centerX=(box.x0+box.x1)/2; this.centerY=(box.y0+box.y1)/2; this.direction=direction; this.oblique=oblique;
        }
    }

    private static final class PositionedTextStripper extends PDFTextStripper {
        private final PageText page;
        private final double pageHeight;
        PositionedTextStripper(PageText page, double pageHeight) throws IOException { this.page=page; this.pageHeight=pageHeight; setSortByPosition(true); }
        @Override protected void writeString(String text, List<TextPosition> positions) {
            if (positions == null || positions.isEmpty()) return;
            double x0=Double.MAX_VALUE, y0=Double.MAX_VALUE, x1=-Double.MAX_VALUE, y1=-Double.MAX_VALUE;
            double direction=positions.get(0).getDir();
            for (TextPosition p : positions) {
                double x=p.getX();
                // PDFBox getY() is the page-oriented, top-origin text coordinate (unlike getYDirAdj(),
                // which rotates vertical captions into a separate text coordinate frame).
                double y=p.getY();
                double width=Math.max(1,p.getWidth()), height=Math.max(1,p.getHeight());
                x0=Math.min(x0,x); x1=Math.max(x1,x+width);
                y0=Math.min(y0,y-height); y1=Math.max(y1,y+1);
            }
            page.runs.add(new TextRun(text,new Rect(x0,y0,x1,y1),direction,false));
        }
    }

    private static final class ImageRegion { final Rect box; final String dataUrl; ImageRegion(Rect box,String dataUrl){this.box=box;this.dataUrl=dataUrl;} }
    private static final class ImageScore { final ImageRegion image; final double distance; ImageScore(ImageRegion image,double distance){this.image=image;this.distance=distance;} }
    private static final class Caption { String name,code,size,sourceLabel,category,reviewReason; double x,centerY; Rect box; ImageRegion image; boolean imageUnique,incompleteLabel; }
    private static final class Rect {
        final double x0,y0,x1,y1;
        Rect(double x0,double y0,double x1,double y1){this.x0=x0;this.y0=y0;this.x1=x1;this.y1=y1;}
        double distance(double x,double y){double dx=Math.max(Math.max(x0-x,0),x-x1);double dy=Math.max(Math.max(y0-y,0),y-y1);return Math.hypot(dx,dy);}
    }

    private final class ImageLocator extends PDFGraphicsStreamEngine {
        private final List<ImageRegion> found=new ArrayList<>();
        ImageLocator(PDPage page)throws IOException{super(page);}
        List<ImageRegion> locate()throws IOException{processPage(getPage());return found;}
        @Override public void drawImage(PDImage image)throws IOException{
            var m=getGraphicsState().getCurrentTransformationMatrix();
            Point2D[] pts={m.transformPoint(0,0),m.transformPoint(1,0),m.transformPoint(0,1),m.transformPoint(1,1)};
            double x0=Double.MAX_VALUE,y0=Double.MAX_VALUE,x1=-Double.MAX_VALUE,y1=-Double.MAX_VALUE;
            for(Point2D p:pts){x0=Math.min(x0,p.getX());x1=Math.max(x1,p.getX());y0=Math.min(y0,p.getY());y1=Math.max(y1,p.getY());}
            double h=getPage().getMediaBox().getHeight();
            Rect box=new Rect(x0,h-y1,x1,h-y0);
            double area=Math.max(0,box.x1-box.x0)*Math.max(0,box.y1-box.y0);
            double pageArea=getPage().getMediaBox().getWidth()*h;
            if(area<=0||area>pageArea*.38)return;
            String data=encodeImage(image);
            if(data!=null)found.add(new ImageRegion(box,data));
        }
        @Override public void appendRectangle(Point2D a,Point2D b,Point2D c,Point2D d){}
        @Override public void clip(int rule){}
        @Override public void moveTo(float x,float y){}
        @Override public void lineTo(float x,float y){}
        @Override public void curveTo(float a,float b,float c,float d,float e,float f){}
        @Override public Point2D getCurrentPoint(){return new Point2D.Double(0,0);}
        @Override public void closePath(){}
        @Override public void endPath(){}
        @Override public void strokePath(){}
        @Override public void fillPath(int rule){}
        @Override public void fillAndStrokePath(int rule){}
        @Override public void shadingFill(COSName name){}
    }
}
