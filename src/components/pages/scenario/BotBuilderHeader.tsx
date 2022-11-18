import { Button } from '@components/general/Button';

export const BotBuilderHeader = () => {
  const cardNum = 12;
  return (
    <div className="botBuilderHeader">
      <div className="botBuilderMakerWrapper">
        <span className="cardNumWrapper">
          말풍선 <span>{cardNum}</span>
        </span>
        <div className="makingBtn">
          <span>단일</span>
          <Button>
            <i className="fa-solid fa-t"></i>
          </Button>
          <Button>
            <i className="fa-regular fa-image"></i>
          </Button>

          <Button>
            <i className="fa-solid fa-images"></i>
          </Button>
          <Button>
            <i className="fa-regular fa-rectangle-list"></i>
          </Button>
          <Button>
            <i className="fa-brands fa-shopify"></i>
          </Button>
        </div>
        <div className="makingBtn">
          <span>캐로셀</span>
          <Button>
            <i className="fa-solid fa-images"></i>
          </Button>
          <Button>
            <i className="fa-solid fa-rectangle-list"></i>
          </Button>
          <Button>
            <i className="fa-solid fa-bag-shopping"></i>
          </Button>
        </div>
        <div className="makingBtn">
          <span>버튼</span>
          <Button>
            <i className="fa-solid fa-toggle-on"></i>
          </Button>
          <Button>
            <i className="fa-solid fa-check"></i>
          </Button>
        </div>
      </div>
      <div className="saveBtn">
        <Button>저장하기</Button>
      </div>
    </div>
  );
};
