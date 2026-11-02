import React, { useEffect, useMemo, useState } from "react";

// Shows the first picture in `sources` that loads. If one fails (missing file, broken link)
// it moves on to the next, so the space is never left blank.
export default function SafeImage({ sources = [], alt = "", className = "", classNameFor, ...rest }) {
  const key = sources.filter(Boolean).join("|");
  const list = useMemo(() => sources.filter(Boolean), [key]); // eslint-disable-line react-hooks/exhaustive-deps
  const [index, setIndex] = useState(0);
  useEffect(() => setIndex(0), [key]);
  if (!list.length) return null;
  const src = list[Math.min(index, list.length - 1)];
  return (
    <img
      {...rest}
      src={src}
      alt={alt}
      className={classNameFor ? classNameFor(src, className) : className}
      onError={() => setIndex((n) => (n < list.length - 1 ? n + 1 : n))}
    />
  );
}
