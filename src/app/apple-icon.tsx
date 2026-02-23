import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0d0d0d",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
        }}
      >
        <div
          style={{
            color: "#c9a96e",
            fontSize: 72,
            fontWeight: 300,
            letterSpacing: "0.15em",
            fontFamily: "serif",
          }}
        >
          L
        </div>
        <div
          style={{
            width: 32,
            height: 1,
            background: "#c9a96e",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
