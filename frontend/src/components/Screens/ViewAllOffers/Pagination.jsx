import React from "react";

import styled from "styled-components";
// import { MdKeyboardArrowRight, MdKeyboardArrowLeft } from "react-icons/md";

const Button = styled.button`
  width: 40px;
  height: 40px;
  font-size: 18px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.33;
  letter-spacing: normal;
  text-align: center;
  color: ${props => (props.active ? "#009fde" : "#666666")};
  align-items: center;
  display: flex;
  justify-content: center;
  border-radius: 3px;
  border: solid 1px ${props => (props.active ? "#009fde" : "#e2e2e2")};
  background-color: #ffffff;
  margin: 0 2px;

  :disabled {
    opacity: 0.4;
  }
  outline: none;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;
`;

const PaginationNumbers = ({
  totalPages,
  current,
  changePage,
  recalculate,
  toggleRecalculate,
  startIn,
  mode
}) => {
  // Regra: 6 botões no desktop, 4 no mobile, chamado de maxButtons
  // as reticencias (...) devem aparecer quando o numero de paginas é > maxButtons

  let maxButtons = 6; //padrão
  if (mode === "mobile") maxButtons = 4;

  // caso o total de páginas seja menor que 6 ou 4
  maxButtons = totalPages > maxButtons ? maxButtons : totalPages;

  const [buttonsArray, setButtonsArray] = React.useState([]);

  console.log("PaginationNumbers", totalPages, current);

  let ellipsisPos = 1;
  let ellipsisGoToPage = current + (maxButtons - 2);

  React.useEffect(() => {
    // console.log("current useefect", current, buttons);
      let buttons = buttonsArray.slice().map(b => {
        return {
          ...b,
          active: b.text === current
        };
      });

    setButtonsArray(buttons);
  }, [current]);

  React.useEffect(() => {
    // if(current > (totalPages)/maxButtons)

    // O número mais a direita (maxRight) deve ser
    // o totalPages
    const maxRight =
      maxButtons + startIn > totalPages ? totalPages : maxButtons + startIn;
    console.log("useeeffect startIn", current, startIn, maxRight);
    let buttons = [];
    for (let i = startIn; i < maxRight; i++) {
      buttons.push({
        text: i,
        active: current === i,
        onClick: () => changePage(i)
      });
    }

    // if (totalPages > maxButtons) {
    if (current < totalPages - (maxButtons - 1)) {
      // colocar os 3 pontinhos aqui
      // menos 1 pq vai de 0 a 5, e menos 1 pq queremos alterar o penultimo
      // ellipsisPos = maxButtons - 2;

      // buttons[ellipsisPos] = <Button onClick={() => ellipsis()}>...</Button>;

      // buttons[ellipsisPos] = {
      //   text: "...",
      //   active: false,
      //   onClick: () => ellipsis()
      // };
      buttons.push({
        text: "...",
        active: false,
        onClick: () => ellipsis()
      });

      // buttons[maxButtons - 1] = {
      //   text: totalPages,
      //   active: current === totalPages,
      //   onClick: () => changePage(totalPages) // ou ellipsisAfter
      // };
      buttons.push({
        text: totalPages,
        active: current === totalPages,
        onClick: () => changePage(totalPages) // ou ellipsisAfter
      });

      buttons.shift();
      buttons.shift();
    }

    setButtonsArray(buttons);
  }, [startIn]);

  React.useEffect(() => {
    // if(current > (totalPages)/maxButtons)
    console.log("useeeffect recalculate", current, startIn);

    let offset = 0;
    if (totalPages - current < 5) {
      // ou n buttons -1
      offset = maxButtons - 1;
    }

    let buttons = [];
    for (let i = current - offset; i < maxButtons + current - offset; i++) {
      buttons.push({
        text: i,
        active: current === i,
        onClick: () => changePage(i)
      });
    }

    // if (totalPages > maxButtons) {
    if (current < totalPages - 5) {
      // colocar os 3 pontinhos aqui
      // menos 1 pq vai de 0 a 5, e menos 1 pq queremos alterar o penultimo
      ellipsisPos = maxButtons - 2;

      buttons[ellipsisPos] = {
        text: "...",
        active: false,
        onClick: () => ellipsis()
      };

      buttons[maxButtons - 1] = {
        text: totalPages,
        active: current === totalPages,
        onClick: () => changePage(totalPages) // ou ellipsisAfter
      };
    }

    setButtonsArray(buttons);
  }, [recalculate]);

  // tem que trocar os núemros quando estamos na ultima 6 e vamos p 7, por exemplo
  const ellipsis = () => {
    console.log("ellipsis!!");
    // guardar a posição da ellipsis,
    // inicio dos botões vai começar no button[ellipsis pos - 1] + 1
    changePage(ellipsisGoToPage);
    //da pra abstrair depois, mudando a posição do ellipsis depois to totalPages/2
    toggleRecalculate(!recalculate);
  };

  return (
    <>
      {buttonsArray.map((buttonInfo, i) => (
        <Button key={i} active={buttonInfo.active} onClick={buttonInfo.onClick}>
          {buttonInfo.text}
        </Button>
      ))}
      {/* {buttonsArray} */}
    </>
  );
};

export default function Pagination({
  elementToRender,
  elementsPerPage,
  handleNextPage,
  totalPages
}) {
  const [page, setPage] = React.useState(1);
  const [data, setData] = React.useState([]);

  const [startIn, setStartIn] = React.useState(0);

  const [recalculate, toggleRecalculate] = React.useState(false);

  React.useEffect(() => {
    // page changed, do something
    // console.log("useeffect page", page);
    const nextPageElements = handleNextPage(page, elementsPerPage);
    // console.log("nextPageElements", nextPageElements);
    setData(nextPageElements);
  }, [page]);

  return (
  <>
    <div className="row">
      {data.map(d => elementToRender(d))}
    </div>
      <ButtonsWrapper>
        <Button
          onClick={() =>
            setPage(page - 1) ||
            setStartIn(page - 4 > 0 ? page - 4 : 1) ||
            toggleRecalculate(!recalculate)
          }
          disabled={page === 1}
        >
          <span>Prev</span>
          {/* <MdKeyboardArrowLeft /> */}
        </Button>
        <PaginationNumbers
          totalPages={totalPages}
          current={page}
          changePage={page => setPage(page)}
          recalculate={recalculate}
          toggleRecalculate={toggleRecalculate}
          startIn={startIn}
          // mode="mobile"
        />
        <Button
          onClick={() => setPage(page + 1) || toggleRecalculate(!recalculate)}
          disabled={page === totalPages}
        >
          <span>Next</span>
          {/* <MdKeyboardArrowRight /> */}
        </Button>
      </ButtonsWrapper>
</>

  );
}
