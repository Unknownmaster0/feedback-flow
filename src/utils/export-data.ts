import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { MessageInterface } from "@/models/models";
import { monthObj, weekObj } from "@/components/MessageCard";

export interface messageI {
  content: string;
  createdAt: string;
}

// Utility function to convert HTML content to plain text
export const parseHtmlToText = (htmlContent: string): string => {
  // Remove all HTML tags
  return htmlContent.replace(/<[^>]*>?/gm, "");
};

// Export all messages to PDF
export const exportMessagesToPDF = async (
  messages: MessageInterface[],
  userInfo: any
) => {
  const pdf = new jsPDF();

  // Add title
  pdf.setFontSize(20);
  pdf.text("Feedback Messages Export", 20, 20);

  // Add user info
  pdf.setFontSize(12);
  pdf.text(`User: ${userInfo.username}`, 20, 35);
  pdf.text(`Export Date: ${new Date().toLocaleDateString()}`, 20, 45);
  pdf.text(`Total Messages: ${messages.length}`, 20, 55);

  let yPosition = 70;

  messages.forEach((message, index) => {
    // Check if we need a new page
    if (yPosition > 250) {
      pdf.addPage();
      yPosition = 20;
    }

    // Message header
    pdf.setFontSize(10);
    pdf.text(
      `Message #${index + 1} - ${new Date(message.createdAt).toLocaleDateString()}`,
      20,
      yPosition
    );
    yPosition += 10;

    // Parse HTML content to plain text
    const plainTextContent = parseHtmlToText(message.content);

    // Message content
    pdf.setFontSize(9);
    const lines = pdf.splitTextToSize(plainTextContent, 170);
    pdf.text(lines, 20, yPosition);
    yPosition += lines.length * 5 + 10;
  });

  // Save the PDF
  pdf.save("feedback-messages-export.pdf");
};

const htmlElement = (message: MessageInterface, theme: "light" | "dark") => {
  const date = new Date(message.createdAt);
  const finalDate = `${weekObj[date.getDay()]} ${monthObj[date.getMonth()]}-${date.getDate()}-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

  const themeStyles =
    theme === "light"
      ? {
          background: "#ffffff",
          textColor: "#1e293b",
          borderColor: "#eb5cf6",
          badgeColor: "#f1f5f9",
        }
      : {
          background: "#1e293b",
          textColor: "#f1f5f9",
          borderColor: "#334155",
          badgeColor: "#475569",
        };

  return `<div style="
  max-width: 500px;
  background: ${themeStyles.background};
  border: 1px solid ${themeStyles.borderColor};
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  margin: 16px 0;
">
  <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
    <div style="
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      font-size: 14px;
    ">A</div>
    <div>
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="font-weight: 600; color: ${themeStyles.textColor};">Anonymous</span>
      </div>
      <div style="font-size: 12px; color: #64748b;">${finalDate}</div>
    </div>
  </div>
  <p style="
    color: ${themeStyles.textColor} !important;
    line-height: 1.6;
    margin: 0;
    font-size: 14px;
  "><style>p, span, div { color: ${themeStyles.textColor} !important; }</style>${message.content}</p>
</div>`;
};

// Export single message as image
export const exportMessageAsImage = async (
  messageElement: HTMLElement,
  message: MessageInterface
) => {
  try {
    // Get the HTML string from the htmlElement function
    const htmlString = htmlElement(message, "light");

    // Create a wrapper div to hold the HTML content
    const wrapper = document.createElement("div");
    wrapper.style.width = "600px"; // Set a fixed width for better image proportions
    wrapper.style.margin = "0 auto";
    wrapper.style.padding = "20px";
    wrapper.style.backgroundColor = "#ffffff";
    wrapper.style.borderRadius = "12px";
    wrapper.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";

    // Set the HTML content to the wrapper
    wrapper.innerHTML = htmlString;

    // Append the wrapper to the body temporarily
    document.body.appendChild(wrapper);

    // Capture the wrapper as an image
    const canvas = await html2canvas(wrapper, {
      backgroundColor: "#ffffff",
      scale: 2,
      useCORS: true,
      allowTaint: true,
    });

    // Remove the wrapper from the body
    document.body.removeChild(wrapper);

    // Create download link
    const link = document.createElement("a");
    link.download = `feedback-message-${message._id}.png`;
    link.href = canvas.toDataURL();
    link.click();
  } catch (error) {
    console.error("Error exporting image:", error);
    throw error;
  }
};

// Generate HTML embed code for a message
export const generateEmbedCode = (
  message: MessageInterface,
  theme: "light" | "dark" = "light"
) => {
  const date = new Date(message.createdAt);
  const finalDate = `${weekObj[date.getDay()]} ${monthObj[date.getMonth()]}-${date.getDate()}-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

  const themeStyles =
    theme === "light"
      ? {
          background: "#ffffff",
          textColor: "#1e293b",
          borderColor: "#eb5cf6",
          badgeColor: "#f1f5f9",
        }
      : {
          background: "#1e293b",
          textColor: "#f1f5f9",
          borderColor: "#334155",
          badgeColor: "#475569",
        };

  return `
<!-- Feedback Message Embed -->
${htmlElement(message, theme)}
<!-- End Feedback Message Embed -->`.trim();
};
