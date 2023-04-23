  export const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;
        options.push(
          <option key={time} value={time}>
            {time}
          </option>
        );
      }
    }
    return options;
  };

  export const add30Minutes = (time: string): string => {
    const [hoursStr, minutesStr] = time.split(":");
    if (!hoursStr || !minutesStr) {
      throw new Error("Invalid time format");
    }
    const hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);
    if (isNaN(hours) || isNaN(minutes)) {
      throw new Error("Invalid time format");
    }
    let newHours = hours;
    let newMinutes = minutes + 30;
    if (newMinutes >= 60) {
      newHours = (newHours + 1) % 24;
      newMinutes -= 60;
    }
    return `${newHours.toString().padStart(2, "0")}:${newMinutes
      .toString()
      .padStart(2, "0")}`;
  };