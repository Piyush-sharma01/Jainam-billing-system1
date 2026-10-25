package com.jainam.service;

import com.jainam.dto.ProductDTO;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.graphics.PDXObject;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Component;
import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
public class ProductCatalogParser {
    private static final int MAX_PRODUCTS = 2000, MAX_IMAGES = 400, MAX_IMAGE_BYTES = 2_000_000;
    private static final Pattern NUMBER = Pattern.compile("^(?:₹|Rs\\.?|INR)?(\\d{1,3}(?:,\\d{2,3})+|\\d+)(\\.\\d{1,2})?(?:/-)?(%)?$", Pattern.CASE_INSENSITIVE);
    private static final Pattern SERIAL_PREFIX = Pattern.compile("^\\d{1,4}[.)]\\s+");
    private static final Pattern PAGE_NUMBER = Pattern.compile("^(page\\s*)?\\d+(\\s*(of|/)\\s*\\d+)?$", Pattern.CASE_INSENSITIVE);
    private static final Pattern SIZE_SUFFIX = Pattern.compile("(?i)(?:\\bsize\\s*[:=\\-]?\\s*)(.+)$|\\b(\\d+(?:\\.\\d+)?\\s*(?:mm|cm|m|inches?|\\\"|g|kg|ml|l|oz|ft|feet|pcs?|sets?))$");
    private static final Set<String> CURRENCY_WORDS = Set.of("rs", "rs.", "₹", "inr", "mrp", "mrp:", "price", "price:", "rate", "rate:");
    private static final List<String> NOISE = List.of("www.", "http", "@", "s.no", "sr no", "sr.no", "hsn", "particulars", "description", "catalogue", "catalog", "price list", "contact", "phone", "email", "address", "all rights", "terms", "subject to", "gstin", "total");

    public List<ProductDTO> parse(byte[] pdfBytes) throws IOException {
        Map<String, ProductDTO> unique = new LinkedHashMap<>();
        List<String> images = new ArrayList<>();
        try (PDDocument doc = Loader.loadPDF(pdfBytes)) {
            PDFTextStripper stripper = new PDFTextStripper();
            stripper.setSortByPosition(true);
            parseText(stripper.getText(doc), unique);
            for (PDPage page : doc.getPages()) {
                for (org.apache.pdfbox.cos.COSName name : page.getResources().getXObjectNames()) {
                    if (images.size() >= MAX_IMAGES) break;
                    PDXObject object = page.getResources().getXObject(name);
                    if (object instanceof PDImageXObject image) {
                        String data = encodeImage(image.getImage());
                        if (data != null) images.add(data);
                    }
                }
            }
        }
        List<ProductDTO> products = new ArrayList<>(unique.values());
        // Embedded photos are exposed row-by-row in document order for review; unmatched rows stay blank.
        for (int i = 0; i < Math.min(products.size(), images.size()); i++) products.get(i).setExtractedImageData(images.get(i));
        return products;
    }

    private String encodeImage(BufferedImage image) throws IOException {
        if (image == null || image.getWidth() < 24 || image.getHeight() < 24) return null;
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        if (!ImageIO.write(image, "jpg", out) || out.size() > MAX_IMAGE_BYTES) return null;
        return "data:image/jpeg;base64," + Base64.getEncoder().encodeToString(out.toByteArray());
    }

    private void parseText(String text, Map<String, ProductDTO> unique) {
        List<String[]> plainLines = new ArrayList<>();
        String category = null;
        for (String raw : text.split("\\R")) {
            String line = raw.replace('\u00A0', ' ').replaceAll("\\s+", " ").trim();
            if (line.length() < 2 || PAGE_NUMBER.matcher(line).matches() || isNoise(line)) continue;
            line = SERIAL_PREFIX.matcher(line).replaceFirst("");
            ParsedLine parsed = splitTrailingNumbers(line);
            if (parsed.name.isEmpty() || !hasLetter(parsed.name)) continue;
            if (parsed.hasNumericTail) add(unique, parsed.name, category, parsed.gst);
            else if (isHeading(line)) category = line.replaceAll("[:\\s]+$", "");
            else if (line.length() <= 80) plainLines.add(new String[]{category, line});
        }
        if (unique.isEmpty()) for (String[] line : plainLines) add(unique, line[1], line[0], null);
    }

    private void add(Map<String, ProductDTO> map, String rawName, String category, BigDecimal gst) {
        if (map.size() >= MAX_PRODUCTS) return;
        String name = rawName.trim(), size = null;
        Matcher matcher = SIZE_SUFFIX.matcher(name);
        if (matcher.find()) {
            size = matcher.group(1) != null ? matcher.group(1).trim() : matcher.group(2).trim();
            name = name.substring(0, matcher.start()).replaceAll("[\\s,|:-]+$", "").trim();
        }
        String key = name.toLowerCase(Locale.ROOT) + "|" + (size == null ? "" : size.toLowerCase(Locale.ROOT));
        if (name.isBlank() || map.containsKey(key)) return;
        ProductDTO dto = new ProductDTO();
        dto.setName(name);
        dto.setSize(size);
        dto.setCategory(category);
        dto.setPrice(null); // Catalogue prices are deliberately not imported.
        dto.setGst(gst);
        dto.setActive(true);
        map.put(key, dto);
    }

    private static class ParsedLine { String name; BigDecimal gst; boolean hasNumericTail; }
    private ParsedLine splitTrailingNumbers(String line) {
        String[] tokens = line.split(" ");
        int end = tokens.length;
        BigDecimal gst = null;
        boolean parsedTail = false;
        while (end > 0) {
            Matcher matcher = NUMBER.matcher(tokens[end - 1]);
            if (!matcher.matches()) break;
            parsedTail = true;
            BigDecimal value = new BigDecimal(matcher.group(1).replace(",", "") + (matcher.group(2) == null ? "" : matcher.group(2)));
            if (matcher.group(3) != null && gst == null) gst = value;
            end--;
        }
        while (end > 0 && CURRENCY_WORDS.contains(tokens[end - 1].toLowerCase(Locale.ROOT))) end--;
        ParsedLine parsed = new ParsedLine();
        parsed.name = String.join(" ", Arrays.copyOfRange(tokens, 0, end)).replaceAll("[\\s\\-–|:.…_]+$", "").trim();
        parsed.gst = gst;
        parsed.hasNumericTail = parsedTail;
        return parsed;
    }
    private boolean isHeading(String line) {
        if (line.length() > 45 || line.split(" ").length > 6) return false;
        return (line.equals(line.toUpperCase(Locale.ROOT)) && hasLetter(line)) || line.endsWith(":");
    }
    private boolean isNoise(String line) {
        String lower = line.toLowerCase(Locale.ROOT);
        for (String noise : NOISE) if (lower.contains(noise)) return true;
        return false;
    }
    private boolean hasLetter(String value) { return value.chars().anyMatch(Character::isLetter); }
}
