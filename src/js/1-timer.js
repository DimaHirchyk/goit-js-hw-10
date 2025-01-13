import 'flatpickr/dist/flatpickr.min.css';
import flatpickr from 'flatpickr';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

let userSelectedDate = null;
const btnStart = document.querySelector('button');
btnStart.disabled = true;

flatpickr('#datetime-picker', {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    userSelectedDate = selectedDates[0];
    if (userSelectedDate <= new Date()) {
      btnStart.disabled = true;
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
      });
    } else {
      btnStart.disabled = false;

      iziToast.success({
        title: 'Success',
        message: 'Valid date selected!',
      });
    }
  },
});

const timer = {
  intervalId: null,
  elements: {
    days: document.querySelector('[data-days]'),
    hours: document.querySelector('[data-hours]'),
    minutes: document.querySelector('[data-minutes]'),
    seconds: document.querySelector('[data-seconds]'),
  },

  start() {
    const dateTimePicker = document.querySelector('#datetime-picker');
    if (!userSelectedDate) return;

    btnStart.disabled = true;
    dateTimePicker.disabled = true;

    this.intervalId = setInterval(() => {
      const currentTime = new Date();
      const timeLeft = userSelectedDate - currentTime;

      if (timeLeft <= 0) {
        this.stop();
        return;
      }

      const timeComponentps = this.displayTimeLeft(timeLeft);

      this.elements.days.textContent = this.pad(timeComponentps.days);
      this.elements.hours.textContent = this.pad(timeComponentps.hours);
      this.elements.minutes.textContent = this.pad(timeComponentps.minutes);
      this.elements.seconds.textContent = this.pad(timeComponentps.seconds);

      this.displayTimeLeft(timeLeft);
    }, 1000);
  },

  stop() {
    clearInterval(this.intervalId);
    this.intervalId = null;
  },

  displayTimeLeft(timeLeft) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = Math.floor(timeLeft / day);
    const hours = Math.floor((timeLeft % day) / hour);
    const minutes = Math.floor(((timeLeft % day) % hour) / minute);
    const seconds = Math.floor((((timeLeft % day) % hour) % minute) / second);

    return { days, hours, minutes, seconds };
  },

  pad(value) {
    return String(value).padStart(2, '0');
  },
};

btnStart.addEventListener('click', () => {
  timer.start();
});
