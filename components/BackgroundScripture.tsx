export default function BackgroundScripture() {
  const verses = [
    "Romans 10:9 If you declare with your mouth Jesus is Lord and believe God raised Him",
    "Acts 4:12 Salvation is found in no one else",
    "Ephesians 2:8 By grace you have been saved through faith",
    "Titus 3:5 He saved us not by works but by His mercy",
    "John 3:16 For God so loved the world",
    "Psalm 119:105 Your word is a lamp to my feet",
    "Hebrews 4:12 The word of God is living and active",
    "2 Corinthians 5:17 New creation in Christ",
    "Isaiah 55:11 My word will not return to me empty",
    "Matthew 4:4 Man shall not live by bread alone",
    "Philippians 4:13 I can do all things through Christ",
    "Colossians 2:13 He has forgiven us all our sins",
    "Galatians 2:20 I have been crucified with Christ",
    "John 14:6 I am the way the truth and the life",
    "Psalm 23:1 The Lord is my shepherd",
    "Romans 8:1 No condemnation in Christ Jesus",
    "1 Peter 2:24 By His wounds you have been healed",
    "Revelation 1:5 He loves us and has freed us",
  ];

  const placements = [
    { top: "6%", left: "3%", rotate: "-6deg", size: "12px", opacity: 0.16, width: "360px" },
    { top: "10%", left: "55%", rotate: "8deg", size: "12px", opacity: 0.14, width: "420px" },
    { top: "18%", left: "78%", rotate: "-10deg", size: "11px", opacity: 0.12, width: "300px" },
    { top: "26%", left: "8%", rotate: "10deg", size: "11px", opacity: 0.13, width: "380px" },
    { top: "34%", left: "60%", rotate: "-4deg", size: "12px", opacity: 0.12, width: "460px" },
    { top: "44%", left: "18%", rotate: "-12deg", size: "11px", opacity: 0.12, width: "420px" },
    { top: "52%", left: "72%", rotate: "12deg", size: "12px", opacity: 0.14, width: "420px" },
    { top: "60%", left: "4%", rotate: "6deg", size: "12px", opacity: 0.12, width: "460px" },
    { top: "68%", left: "52%", rotate: "-8deg", size: "11px", opacity: 0.13, width: "520px" },
    { top: "76%", left: "74%", rotate: "7deg", size: "12px", opacity: 0.12, width: "360px" },
    { top: "84%", left: "10%", rotate: "-7deg", size: "12px", opacity: 0.12, width: "520px" },
    { top: "90%", left: "55%", rotate: "9deg", size: "11px", opacity: 0.12, width: "420px" },
  ];

  return (
    <div aria-hidden className="scripture-bg">
      {placements.map((p, i) => {
        const text = verses[i % verses.length];
        return (
          <div
            key={i}
            className="scripture-snippet"
            style={{
              top: p.top,
              left: p.left,
              transform: `rotate(${p.rotate})`,
              fontSize: p.size,
              opacity: p.opacity,
              width: p.width,
            }}
          >
            {text}
          </div>
        );
      })}
    </div>
  );
}
