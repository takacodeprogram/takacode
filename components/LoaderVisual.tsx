interface MatrixColumn {
  x: string;
  delay: string;
  duration: string;
  text: string;
}

export default function LoaderVisual() {
  const matrixColumns: MatrixColumn[] = [
    { x: "4%", delay: "0s", duration: "4.6s", text: "01011010100101101010" },
    { x: "12%", delay: "-1.2s", duration: "5.2s", text: "10100100101101001011" },
    { x: "20%", delay: "-0.8s", duration: "4.9s", text: "00101101001011010010" },
    { x: "30%", delay: "-2.1s", duration: "5.5s", text: "11010010110100101101" },
    { x: "40%", delay: "-1.6s", duration: "4.7s", text: "01001011010010110100" },
    { x: "52%", delay: "-0.3s", duration: "5.1s", text: "10110100101101001011" },
    { x: "63%", delay: "-2.4s", duration: "4.8s", text: "00101101001011010010" },
    { x: "74%", delay: "-1s", duration: "5.4s", text: "11010010110100101101" },
    { x: "84%", delay: "-2.8s", duration: "4.5s", text: "01011010010110100101" },
    { x: "93%", delay: "-0.6s", duration: "5s", text: "10100101101001011010" }
  ];

  return (
    <>
      <div className="startup-loader-matrix" aria-hidden="true">
        {matrixColumns.map((column, index) => (
          <span
            key={`${column.x}-${index}`}
            className={`matrix-column${index % 2 === 0 ? "" : " dim"}`}
            style={{ "--x": column.x, "--delay": column.delay, "--duration": column.duration } as React.CSSProperties & Record<string, string>}
          >
            {column.text}
          </span>
        ))}
      </div>

      <div className="startup-loader-core" aria-hidden="true">
        <img src="/logo-light-2.png" alt="" className="startup-loader-logo" />
      </div>

      <div className="startup-loader-text font-venite-italic">INITIALISATION</div>
    </>
  );
}
