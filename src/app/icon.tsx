import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0d0d0d",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            color: "#c9a96e",
            fontSize: 18,
            fontWeight: 300,
            letterSpacing: "0.1em",
            fontFamily: "serif",
          }}
        >
          L
        </div>
      </div>
    ),
    { ...size }
  );
}
