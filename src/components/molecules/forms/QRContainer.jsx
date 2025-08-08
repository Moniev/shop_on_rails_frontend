import { QRCodeCanvas } from "qrcode.react";
import "./QRContainer.scss"; 


const QRContainer = ({ isActive }) => {
  const loginUrl = "rudyk-cwel";

  return (
    <div className={`qr-container ${isActive ? 'active' : ''}`}>
      <p className="qr-container__info">... or scan QR code</p>
      
      <div className="qr-container__code-wrapper">
        <QRCodeCanvas
          value={loginUrl}
          size={200}
          bgColor={"#ffffff"}
          fgColor={"#000000"}
          level={"Q"}
        />
      </div>

      <p className="qr-container__prompt">
        Use our mobile app to scan and sign in.
      </p>
    </div>
  );
};

export default QRContainer;