export const humanReadableTime = (time: number | string) => {
  if (typeof time === "number" && time < 0) {
    time = 0;
  }
  let minutes, secs;
  if (typeof time === "string") {
    const spit = time.split(":");
    const hours = +spit[0].replace(/^0/, "");
    minutes = +spit[1].replace(/^0/, "") + hours * 60;
    secs = spit[2].replace(/^0/, "");
    secs = +secs >= 10 ? secs : `0${secs}`;
  } else {
    minutes = Math.floor(time / 60);
    secs = time % 60 >= 10 ? time % 60 : `0${time % 60}`;
  }
  const timeString = `${minutes}:${secs}`;
  return minutes > 0 ? timeString : "0";
};