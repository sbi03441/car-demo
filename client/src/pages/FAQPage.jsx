import { useState, useEffect } from "react";
import { getAllFAQs } from "../services/faqsService";

export default function FAQPage() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openItems, setOpenItems] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("전체");

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        setLoading(true);
        const response = await getAllFAQs();

        if (response.success) {
          setFaqs(response.data);
        } else {
          setError('FAQ 목록을 불러오는데 실패했습니다.');
        }
      } catch (err) {
        console.error('FAQ 목록 조회 오류:', err);
        setError('FAQ 목록을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchFAQs();
  }, []);

  const toggleItem = (id) => {
    setOpenItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // FAQs를 카테고리별로 그룹화
  const groupedFAQs = faqs.reduce((acc, faq) => {
    if (!acc[faq.category]) {
      acc[faq.category] = [];
    }
    acc[faq.category].push(faq);
    return acc;
  }, {});

  // 카테고리 목록 생성
  const categories = ["전체", ...Object.keys(groupedFAQs)];

  // 선택된 카테고리에 따라 FAQ 데이터 필터링
  const faqData = selectedCategory === "전체"
    ? Object.keys(groupedFAQs).map(category => ({
        category,
        questions: groupedFAQs[category]
      }))
    : [{
        category: selectedCategory,
        questions: groupedFAQs[selectedCategory] || []
      }];

  if (loading) {
    return (
      <div className="faq-page">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>FAQ 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="faq-page">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ color: 'red' }}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="faq-page">
      {/* 헤더 */}
      <div className="faq-header">
        <h1>자주 묻는 질문</h1>
        <p className="faq-subtitle">궁금하신 내용을 빠르게 확인하세요</p>
      </div>

      {/* 카테고리 필터 */}
      <div className="faq-category-filter">
        <div className="category-buttons">
          {categories.map((category) => (
            <button
              key={category}
              className={`category-button ${selectedCategory === category ? "active" : ""}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ 목록 */}
      <div className="faq-content">
        {faqData.map((categoryData) => (
          <div key={categoryData.category} className="faq-category-section">
            <h2 className="category-title">{categoryData.category}</h2>
            <div className="faq-items">
              {categoryData.questions.map((item) => (
                <div
                  key={item.id}
                  className={`faq-item ${openItems[item.id] ? "open" : ""}`}
                >
                  <button
                    className="faq-question"
                    onClick={() => toggleItem(item.id)}
                  >
                    <span className="question-icon">Q</span>
                    <span className="question-text">{item.question}</span>
                    <span className="toggle-icon">
                      {openItems[item.id] ? "−" : "+"}
                    </span>
                  </button>
                  {openItems[item.id] && (
                    <div className="faq-answer">
                      <span className="answer-icon">A</span>
                      <p className="answer-text">{item.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 추가 문의 섹션 */}
      <div className="faq-contact">
        <h3>원하는 답변을 찾지 못하셨나요?</h3>
        <p>고객센터를 통해 문의해주시면 친절하게 안내해드리겠습니다.</p>
        <div className="contact-info">
          <div className="contact-item">
            <span className="contact-label">전화 문의</span>
            <span className="contact-value">1588-0000</span>
          </div>
          <div className="contact-item">
            <span className="contact-label">운영 시간</span>
            <span className="contact-value">평일 09:00 - 18:00</span>
          </div>
        </div>
        <button className="contact-button-primary">1:1 문의하기</button>
      </div>
    </div>
  );
}
