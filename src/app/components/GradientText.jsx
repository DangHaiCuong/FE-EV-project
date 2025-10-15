/**
 * Component: GradientText
 * PURPOSE: Tô chữ bằng gradient (thay vì 1 màu đơn).
 * RUNS WHEN: Render bất cứ nơi nào bạn bọc <GradientText>...children...</GradientText>.
 * INPUTS: { children } — nội dung văn bản cần tô gradient.
 * OUTPUTS: <span> với style gradient được clip theo hình dạng chữ.
 * READS: không đọc state/context bên ngoài.
 * WRITES / SIDE EFFECTS: không ghi/side-effect.
 * NOTE: Dùng background-clip để hiển thị gradient trong phần chữ (text).
 */
export default function GradientText({ children }) {
  return (
    <span
      style={{
        // Nền gradient chạy ngang trái → phải
        background: "linear-gradient(90deg, #6d4aff 0%, #4f7dff 45%, #00cdeb 100%)",

        // CLIP: chỉ lấy phần nền trùng với hình chữ
        WebkitBackgroundClip: "text", // Safari/Chrome
        backgroundClip: "text",       // Chuẩn spec (trình duyệt khác dần hỗ trợ)

        // Làm chữ trong suốt để thấy nền ở dưới
        color: "transparent",
        // Safari tốt hơn nếu thêm dòng dưới; để đơn giản bạn có thể bỏ,
        // hoặc bật trong bản “pro” bên dưới:
        // WebkitTextFillColor: "transparent",
      }}
    >
      {children}
    </span>
  );
}
