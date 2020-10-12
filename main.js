class Calculator {
  constructor(previous_operand_txt_element, current_operand_txt_element) {
    this.previous_operand_txt_element = previous_operand_txt_element;
    this.current_operand_txt_element = current_operand_txt_element;
    this.clear();
  }

  clear() {
    this.previous_operand = '';
    this.current_operand = '';
    this.operation = undefined;
    this.result = false;
  }

  set_result() {
    this.result = true;
  }

  delete() {
    if (this.current_operand == 'NaN') return;
    this.current_operand = this.current_operand.toString().slice(0, -1);
  }

  append_number(number) {
    if (this.current_operand == 'NaN') return;
    if (this.result && !this.operation) {
      this.clear();
      this.result = false;
    }
    if (number == '.' && this.current_operand.includes('.')) return;
    if (number == '.' && !this.current_operand) this.current_operand = '0' + number.toString();
    this.current_operand = this.current_operand.toString() + number.toString();
  }

  get_sqrt() {
    let current = parseFloat(this.current_operand);
    if (current < 0) {
      this.current_operand = 'NaN';
      return;
    }
    let computation = Math.sqrt(current);
    if (isNaN(current)) return;
    this.current_operand = computation;
  }

  set_negative() {
    if (this.current_operand == '' || this.current_operand == 'NaN') return;
    let current = parseFloat(this.current_operand);
    this.current_operand = -1 * current;
  }

  choose_decimal(operand1, operand2, mul = 0) {
    let prev = (operand1.toString().split('.')[1]) ? operand1.toString().split('.')[1].length : 0;
    let current = (operand2.toString().split('.')[1]) ? operand2.toString().split('.')[1].length : 0;
    if (mul == 0) return Math.max(prev, current);
    else return prev + current;
  }

  chose_operation(operator) {
    if (this.current_operand == '' || this.current_operand == 'NaN') return;
    if (this.previous_operand != '') this.compute();
    this.operation = operator;
    this.previous_operand = this.current_operand.toString();
    this.current_operand = '';
  }

  compute() {
    let computation;
    let prev = parseFloat(this.previous_operand);
    let current = parseFloat(this.current_operand);
    let decimal;
    if (prev.toString().includes('.') && current.toString().includes('.')) {
      decimal = this.choose_decimal(prev, current);
    }
    if (isNaN(prev) || isNaN(current)) return;
    switch(this.operation) {
      case '+':
          if (decimal == undefined) computation = prev + current;
          else computation = +parseFloat(prev + current).toFixed(decimal);
          break;
      case '-':
          if (decimal == undefined) computation = prev - current;
          else computation = +parseFloat(prev - current).toFixed(decimal);
          break;
      case '*':
          if (decimal != undefined || current.toString().includes('.') || prev.toString().includes('.')) {
            decimal = this.choose_decimal(prev, current, 1);
            computation = +parseFloat(prev * current).toFixed(decimal);
          }
          else computation = prev * current;
          break;
      case '/':
          if (decimal == undefined) computation = prev / current;
          else computation = +parseFloat(prev / current).toFixed(decimal);
          break;
      case 'xn':
          if (prev.toString().includes('.') && !current.toString().includes('.')) {
            decimal = current * prev.toString().split('.')[1].length;
            computation = +parseFloat(Math.pow(prev, current)).toFixed(decimal);
          } else {
            computation = Math.pow(prev, current);
          }
          break;
      default:
          return
    }
    this.current_operand = computation;
    this.operation = undefined;
    this.previous_operand = '';
  }

  get_display_number(number) {
    const string_number = number.toString();
    const integer_digits = parseFloat(string_number.split('.')[0]);
    const decimal_digits = string_number.split('.')[1];
    let integer_display;
    if (isNaN(integer_digits)) {
      integer_display = '';
    } else {
      integer_display = integer_digits.toLocaleString('en', { maximumFractionDigits: 0 });
    }
    if (decimal_digits != null) {
      return `${integer_display}.${decimal_digits}`;
    } else {
      return integer_display;
    }
  }

  update_display() {
    if (this.current_operand == 'NaN') {
      this.current_operand_txt_element.innerText =
        this.current_operand;
    } else {
      this.current_operand_txt_element.innerText =
        this.get_display_number(this.current_operand);
    }
    if (this.operation != null && this.operation != 'xn') {
      this.previous_operand_txt_element.innerText =
        `${this.get_display_number(this.previous_operand)} ${this.operation}`;
    } else if (this.operation == 'xn') {
      this.previous_operand_txt_element.innerText =
        `${this.get_display_number(this.previous_operand)} ^`;
    } else this.previous_operand_txt_element.innerText = '';
  }
}

const buttons_number = document.querySelectorAll('[data-number]');
const buttons_operator = document.querySelectorAll('[data-operation]');
const button_equals = document.querySelector('[data-equals]');
const button_all_clear = document.querySelector('[data-all-clear]');
const button_delete = document.querySelector('[data-delete]');
const button_operation_sqrt = document.querySelector('[data-operation-sqrt]');
const button_operation_negative = document.querySelector('[data-operation-negative]');
const previous_operand_txt_element = document.querySelector('[data-previous-operand]');
const current_operand_txt_element = document.querySelector('[data-current-operand]');

const calculator = new Calculator(previous_operand_txt_element, current_operand_txt_element);

buttons_number.forEach(button => button.addEventListener('click', function() {
  calculator.append_number(button.innerText);
  calculator.update_display();
}));

buttons_operator.forEach(button => button.addEventListener('click', function() {
  calculator.chose_operation(button.innerText);
  calculator.update_display();
}))

button_delete.addEventListener('click', function() {
  calculator.delete();
  calculator.update_display();
})

button_equals.addEventListener('click', function() {
  calculator.compute();
  calculator.update_display();
  calculator.set_result();
})

button_all_clear.addEventListener('click', function() {
  calculator.clear();
  calculator.update_display();
})

button_operation_sqrt.addEventListener('click', function() {
  calculator.get_sqrt();
  calculator.update_display();
})

button_operation_negative.addEventListener('click', function() {
  calculator.set_negative();
  calculator.update_display();
})
