export function getHoroscope(dateString: string): string {
  const date = new Date(dateString);
  const month = date.getMonth() + 1; 
  const day = date.getDate();

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) {
    return "♈ Aries";
  } else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) {
    return "♉ Taurus";
  } else if ((month === 5 && day >= 21) || (month === 6 && day <= 21)) {
    return "♊ Gemini";
  } else if ((month === 6 && day >= 22) || (month === 7 && day <= 22)) {
    return "♋ Cancer";
  } else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) {
    return "♌ Leo";
  } else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) {
    return "♍ Virgo";
  } else if ((month === 9 && day >= 23) || (month === 10 && day <= 23)) {
    return "♎ Libra";
  } else if ((month === 10 && day >= 24) || (month === 11 && day <= 21)) {
    return "♏ Scorpius";
  } else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) {
    return "♐ Sagittarius";
  } else if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) {
    return "♑ Capricornus";
  } else if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) {
    return "♒ Aquarius";
  } else {
    return "♓ Pisces";
  }
}



export function getZodiac(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();

  const zodiacSigns = [
    "Monkey", "Rooster", "Dog", "Pig", "Rat", "Ox",
    "Tiger", "Rabbit", "Dragon", "Snake", "Horse", "Goat"
  ];

  const index = (year - 4) % 12;
  return zodiacSigns[index];
}
  