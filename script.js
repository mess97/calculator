(function () {
  "use strict";

  const get = (target) => {
    return document.querySelector(target);
  };

  const getAll = (target) => {
    return document.querySelectorAll(target);
  };

  class Calculator {
    constructor(element) {
      this.element = element;
      this.currentValue = ""; //현재 값
      this.prevValue = ""; //이전 값
      this.operation = null; //연산자
    }

    reset() {
      this.currentValue = "";
      this.prevValue = "";
      this.resetOpreation();
    }

    clear() {
      if (this.currentValue) {
        //현재 값이 있을 경우에는 현재 값을 초기화
        this.currentValue = "";
        const elements = Array.from(getAll(".operation"));
        //filter 함수: elements배열에서
        //operation(연사자 요소)를 포함한 첫 번째 요소를 찾습니다
        //찾은 요소를 element 변수에 할당합니다.
        if (this.operation) {
          //연산자 있는 경우에는 연산자 버튼에 다시 active를 넣어주기
          const element = elements.filter((element) =>
            element.innerText.includes(this.operation)
          )[0];

          element.classList.add("active");
        }
        return;
      }
      //-------------------
      if (this.operation) {
        //연산자 있을경우 연산자를 초기화 합니다
        this.resetOpreation();
        //연산자만 있을 경우에는 연산자클릭시 현재값을 이전값으로 할당 되었기때문에
        //이전값을 다시 현재 값으로 할당
        this.currentValue = this.prevValue;

        return;
      }
      if (this.prevValue) {
        this.prevValue = "";

        return;
      }
    }
    //숫자를 입력을 받을때 하나하나식 잇풋창에 넘겨주는 매서드
    appendNumber(number) {
      //매개변수는(button.innerText) 숫자버튼/점 요소 의 텍스트
      //숫자 버튼요소 클릭시 연산자 버튼는 active가 취소됨
      const elements = Array.from(getAll(".operation"));
      elements.forEach((element) => {
        element.classList.remove("active");
      });
      //만약에 요소가 점 이고 현재값중에서 점이 들어가 있다면 리턴 (아래코드를 실행하지 않는다)
      if (
        (number === "." && this.currentValue.includes(".")) ||
        (number === "." && this.currentValue == "")
      )
        return;

      //현재 값은 = '현재값'에+'받은값' 예 '1'+'1'='11'
      this.currentValue = this.currentValue.toString() + number.toString();
    }

    // 매개변수를 button으로 바꿔야됨
    setOpreation(button) {
      //매개변수는(button.innerText) 연사자 요소 의 텍스트
      this.operation = button.innerText;
      //이전값에 현재값을 넣어주고
      this.prevValue = this.currentValue;
      //현재값을 없애줘서 인풋창에도 없애줌
      this.currentValue = "";

      button.classList.add("active");
    }

    //인풋창의 값을 업데이트 하는 매서드
    updateDisplay() {
      //만약 this.currentValue가 존재한다면
      if (this.currentValue) {
        //현재 인풋창의 vlaue=현재 값
        this.element.value = this.currentValue;
        return;
      }
      //만약에 이전 값이 있으면
      if (this.prevValue) {
        //인풋차에 value= 이전값
        this.element.value = this.prevValue;
        return;
      }
      this.element.value = 0;
    }

    //operation을 초기화 해주는 매서드
    resetOpreation() {
      //operation 값을 초기화 하고
      this.operation = null;
      //모든operation 요소를 배열로 만들서 순회를 하며
      //active 클라스 네임을 없애준다
      const elements = Array.from(getAll(".operation"));
      elements.forEach((element) => {
        element.classList.remove("active");
      });
    }

    compute() {
      //연산결과값
      let computation;
      //이전값을 형변화 해서 prev에 할당
      const prev = parseFloat(this.prevValue);
      //현재값을 형변화 해서 current에 할당
      const current = parseFloat(this.currentValue);
      //이전값과 현재값이 넘바가 아니경우 그냥 리턴을
      if (isNaN(prev) || isNaN(current)) return;
      //스위치문:
      switch (this.operation) {
        case "+":
          //더하기 일때
          computation = prev + current;
          break;
        case "-":
          computation = prev - current;
          break;
        case "*":
          computation = prev * current;
          break;
        case "÷":
          computation = prev / current;
          break;
        default:
          return;
      }
      //결과값을 현재값에 할당하고
      this.currentValue = computation.toString();
      //이전값은 초기화 해줍니다
      this.prevValue = "";

      this.resetOpreation();
    }
  }
  //숫자 버튼요소를 전부 가져오기
  const numberButtons = getAll(".cell_button.number");
  //연산자 버튼 요소를 번부 가져오기
  const operationButtons = getAll(".cell_button.operation");
  //=결과버튼 요소를 가져오기
  const computeButton = get(".cell_button.compute");
  //clear 버트 요소를 가져오기기
  const clearButton = get(".cell_button.clear");
  //
  const allClearButton = get(".cell_button.all_clear");
  //이풋창의 요소를 전부 가져오기
  const display = get(".display");

  const calculator = new Calculator(display);

  //전부 숫자  버튼요소를 순회
  numberButtons.forEach((button) => {
    //매번 순회한 요소를 클릭 이벤트를 만듬
    button.addEventListener("click", () => {
      //받은 버튼 요소의 텍스트를 넘겨주고
      //숫자를 입력을 받을때 하나하나식 잇풋창에 넘겨주는 매서드
      calculator.appendNumber(button.innerText);

      calculator.updateDisplay();
    });
  });
  //전부 조작 연산자  버튼요소를 순회
  operationButtons.forEach((button) => {
    button.addEventListener("click", () => {
      //오퍼레이션(조작) 을 누를때 연산자를  operation에 할당,지정해주는  매서드
      calculator.setOpreation(button);
      calculator.updateDisplay();
    });
  });
  //computeButton->(=) 의 요소를 클릭시
  computeButton.addEventListener("click", () => {
    //이전값과 현재 값을 계산하는 메서드
    calculator.compute();
    calculator.updateDisplay();
  });
  //클리어 버튼 클릭시
  clearButton.addEventListener("click", () => {
    //클리어 매서드
    calculator.clear();
    calculator.updateDisplay();
  });

  allClearButton.addEventListener("click", () => {
    calculator.reset();
    calculator.updateDisplay();
  });
})();
