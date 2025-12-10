import { useState } from "react";

// FAQ 데이터
const faqData = [
  {
    category: "구매 관련",
    questions: [
      {
        id: 1,
        question: "차량 구매 절차는 어떻게 되나요?",
        answer: "차량 선택 → 견적 구성 → 상담 신청 → 계약 → 차량 인도 순서로 진행됩니다. 온라인으로 견적을 먼저 확인하신 후, 전시장 방문 또는 온라인 상담을 통해 구매를 진행하실 수 있습니다."
      },
      {
        id: 2,
        question: "온라인으로만 구매가 가능한가요?",
        answer: "온라인으로 견적 확인 및 상담 신청이 가능하며, 최종 계약은 전시장 방문 또는 비대면 계약 중 선택하실 수 있습니다. 전시장에서 실차를 직접 확인하시는 것을 권장드립니다."
      },
      {
        id: 3,
        question: "시승은 어떻게 신청하나요?",
        answer: "전시장 찾기 페이지에서 가까운 전시장을 선택하여 '방문 예약' 버튼을 클릭하시거나, 고객센터(1588-0000)로 연락주시면 시승 일정을 예약하실 수 있습니다."
      },
      {
        id: 4,
        question: "차량 인도는 얼마나 걸리나요?",
        answer: "차량 모델 및 옵션에 따라 다르지만, 일반적으로 계약 후 4-8주 정도 소요됩니다. 재고 차량의 경우 더 빠른 인도가 가능할 수 있습니다."
      }
    ]
  },
  {
    category: "금융/할부",
    questions: [
      {
        id: 5,
        question: "할부 구매가 가능한가요?",
        answer: "네, 다양한 할부 프로그램을 제공하고 있습니다. 12개월부터 최대 60개월까지 선택 가능하며, 금리는 신용도에 따라 달라질 수 있습니다. 전시장 상담을 통해 맞춤형 금융 상담을 받으실 수 있습니다."
      },
      {
        id: 6,
        question: "리스와 할부의 차이가 무엇인가요?",
        answer: "할부는 차량 소유권이 고객님께 있으며 매월 원금과 이자를 상환하는 방식입니다. 리스는 차량을 빌려 사용하는 개념으로 월 납입금이 할부보다 낮지만, 계약 종료 시 차량을 반납하거나 잔존가치를 지불해야 합니다."
      },
      {
        id: 7,
        question: "중도 상환 수수료가 있나요?",
        answer: "할부 계약의 경우 중도 상환 수수료가 발생할 수 있습니다. 수수료율은 계약 조건에 따라 다르며, 상담 시 자세한 안내를 받으실 수 있습니다."
      }
    ]
  },
  {
    category: "보증/서비스",
    questions: [
      {
        id: 8,
        question: "차량 보증 기간은 어떻게 되나요?",
        answer: "신차의 경우 기본 3년 또는 60,000km 보증이 제공되며, 파워트레인은 5년 또는 100,000km까지 보증됩니다. 차량 모델에 따라 보증 조건이 다를 수 있습니다."
      },
      {
        id: 9,
        question: "정기 점검은 어디서 받을 수 있나요?",
        answer: "전국 Car Demo 공식 서비스센터에서 정기 점검 및 수리 서비스를 제공합니다. 전시장 찾기 페이지에서 '정비 서비스'를 제공하는 센터를 확인하실 수 있습니다."
      },
      {
        id: 10,
        question: "무상 점검 기간은 얼마나 되나요?",
        answer: "신차 구매 시 첫 1년 동안 2회의 무상 정기 점검이 제공됩니다. 점검 주기는 6개월 또는 10,000km 중 먼저 도래하는 시점입니다."
      }
    ]
  },
  {
    category: "교환/환불",
    questions: [
      {
        id: 11,
        question: "차량 인도 후 교환이 가능한가요?",
        answer: "차량 인도 후 7일 이내, 주행거리 500km 미만인 경우 차량 교환이 가능합니다. 단, 차량에 손상이 없어야 하며, 교환 사유에 따라 수수료가 발생할 수 있습니다."
      },
      {
        id: 12,
        question: "계약 취소는 어떻게 하나요?",
        answer: "차량 인도 전 계약 취소 시 계약금 공제 후 환불이 가능합니다. 차량 생산이 시작된 경우 추가 위약금이 발생할 수 있으므로, 계약서 상의 취소 조항을 확인해 주시기 바랍니다."
      }
    ]
  },
  {
    category: "기타",
    questions: [
      {
        id: 13,
        question: "전국 어디서나 탁송이 가능한가요?",
        answer: "네, 전국 어디든 차량 탁송 서비스를 제공하고 있습니다. 탁송 비용은 거리에 따라 차등 적용되며, 일부 지역의 경우 추가 일정이 소요될 수 있습니다."
      },
      {
        id: 14,
        question: "법인 구매도 가능한가요?",
        answer: "네, 법인 구매가 가능합니다. 법인 전용 할부 및 리스 프로그램도 제공하고 있으니, 사업자등록증을 지참하시어 전시장을 방문하시거나 법인 전용 상담 라인(1588-0001)으로 연락 주시기 바랍니다."
      },
      {
        id: 15,
        question: "장애인 차량 구매 지원이 있나요?",
        answer: "장애인 고객을 위한 특별 할인 프로그램과 편의 장치 지원이 제공됩니다. 장애인 등록증을 지참하시어 전시장에서 상담받으시면 자세한 혜택을 안내받으실 수 있습니다."
      }
    ]
  }
];

export default function FAQPage() {
  const [openItems, setOpenItems] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("전체");

  const toggleItem = (id) => {
    setOpenItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const categories = ["전체", ...faqData.map(item => item.category)];

  const filteredFAQs = selectedCategory === "전체"
    ? faqData
    : faqData.filter(item => item.category === selectedCategory);

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
        {filteredFAQs.map((categoryData) => (
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
