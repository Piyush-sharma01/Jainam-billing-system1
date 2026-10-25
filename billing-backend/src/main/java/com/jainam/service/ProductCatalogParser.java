package com.jainam.service;

import com.jainam.dto.ProductDTO;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Reads a catalogue PDF and guesses products from its text.
 *
 * Rules (simple on purpose, the admin reviews the result before saving):
 *  - A line that ends with number(s) is a product:  "PVC Elbow 20mm   45.00   18%"
 *      text before the trailing numbers = name
 *      number with %                    = GST
 *      last plain number                = price
 *  - A short ALL-CAPS line (or one ending with ':') is a category heading
 *    and applies to the products under it.
 *  - If no priced lines are found at all, every text line becomes a product name.
 */
@Component
public class ProductCatalogParser {

    private static final int MAX_PRODUCTS = 2000;

    private static final Pattern NUMBER = Pattern.compile(
            "^(?:₹|Rs\\.?|INR)?(\\d{1,3}(?:,\\d{2,3})+|\\d+)(\\.\\d{1,2})?(?:/-)?(%)?$",
            Pattern.CASE_INSENSITIVE);
    private static final Pattern SERIAL_PREFIX = Pattern.compile("^\\d{1,4}[.)]\\s+");
    private static final Pattern PAGE_NUMBER = Pattern.compile(
            "^(page\\s*)?\\d+(\\s*(of|/)\\s*\\d+)?$", Pattern.CASE_INSENSITIVE);
    private static final Set<String> CURRENCY_WORDS = Set.of(
            "rs", "rs.", "₹", "inr", "mrp", "mrp:", "price", "price:", "rate", "rate:");
    private static final List<String> NOISE = List.of(
            "www.", "http", "@", "s.no", "sr no", "sr.no", "hsn", "particulars", "description",
            "catalogue", "catalog", "price list", "contact", "phone", "email", "address",
            "all rights", "terms", "subject to", "gstin", "total");

    public List<ProductDTO> parse(byte[] pdfBytes) throws IOException {
        String text;
        try (PDDocument doc = Loader.loadPDF(pdfBytes)) {
            PDFTextStripper stripper = new PDFTextStripper();
            stripper.setSortByPosition(true);
            text = stripper.getText(doc);
        }

        Map<String, ProductDTO> unique = new LinkedHashMap<>();
        // lines without a price, kept for the "names only" fallback
        List<String[]> plainLines = new ArrayList<>(); // [category, line]
        String category = null;

        for (String raw : text.split("\\R")) {
            String line = raw.replace('\u00A0', ' ').replaceAll("\\s+", " ").trim();
            if (line.length() < 2 || PAGE_NUMBER.matcher(line).matches() || isNoise(line)) continue;

            line = SERIAL_PREFIX.matcher(line).replaceFirst("");

            ParsedLine p = splitTrailingNumbers(line);
            if (p.name.isEmpty() || !hasLetter(p.name)) continue;

            if (p.price != null || p.gst != null) {
                add(unique, p.name, category, p.price, p.gst);
            } else if (isHeading(line)) {
                category = line.replaceAll("[:\\s]+$", "");
            } else if (line.length() <= 80) {
                plainLines.add(new String[]{category, line});
            }
        }

        if (unique.isEmpty()) {
            for (String[] l : plainLines) add(unique, l[1], l[0], null, null);
        }
        return new ArrayList<>(unique.values());
    }

    private void add(Map<String, ProductDTO> map, String name, String category, BigDecimal price, BigDecimal gst) {
        if (map.size() >= MAX_PRODUCTS) return;
        String key = name.toLowerCase() + "|" + price;
        if (map.containsKey(key)) return;
        ProductDTO dto = new ProductDTO();
        dto.setName(name);
        dto.setCategory(category);
        dto.setPrice(price);
        dto.setGst(gst);
        dto.setActive(true);
        map.put(key, dto);
    }

    private static class ParsedLine {
        String name;
        BigDecimal price;
        BigDecimal gst;
    }

    private ParsedLine splitTrailingNumbers(String line) {
        String[] t = line.split(" ");
        int end = t.length;
        List<BigDecimal> plain = new ArrayList<>();
        BigDecimal gst = null;

        while (end > 0) {
            Matcher m = NUMBER.matcher(t[end - 1]);
            if (!m.matches()) break;
            BigDecimal v = new BigDecimal(m.group(1).replace(",", "") + (m.group(2) == null ? "" : m.group(2)));
            if (m.group(3) != null) {
                if (gst == null) gst = v;
            } else {
                plain.add(0, v);
            }
            end--;
        }
        // drop a currency word like "Rs." / "MRP" that sits right before the numbers
        while (end > 0 && CURRENCY_WORDS.contains(t[end - 1].toLowerCase())) end--;

        ParsedLine p = new ParsedLine();
        p.name = String.join(" ", Arrays.copyOfRange(t, 0, end)).replaceAll("[\\s\\-–|:.…_]+$", "").trim();
        p.price = plain.isEmpty() ? null : plain.get(plain.size() - 1);
        p.gst = gst;
        return p;
    }

    private boolean isHeading(String line) {
        if (line.length() > 45 || line.split(" ").length > 6) return false;
        boolean allCaps = line.equals(line.toUpperCase()) && hasLetter(line);
        return allCaps || line.endsWith(":");
    }

    private boolean isNoise(String line) {
        String l = line.toLowerCase();
        for (String n : NOISE) if (l.contains(n)) return true;
        return false;
    }

    private boolean hasLetter(String s) {
        return s.chars().anyMatch(Character::isLetter);
    }
}
