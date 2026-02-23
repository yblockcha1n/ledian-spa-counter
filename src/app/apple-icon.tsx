import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  const svgData = readFileSync(join(process.cwd(), "public/icon-color.svg"));
  const base64 = svgData.toString("base64");
  const dataUrl = `data:image/svg+xml;base64,${base64}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#c9a96e",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "28px",
        }}
      >
        <img
          src={dataUrl}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
