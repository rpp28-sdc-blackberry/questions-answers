const createRatingsRecommendedObj = (rows) => {
  const ratings = {};
  const recommended = {
    true: 0,
    false: 0,
  };

  rows.forEach((row) => {
    const rating = row.rating;
    const recommendedValue = row.recommend;
    if (!ratings[rating]) {
      ratings[rating] = 1;
    } else {
      ratings[rating] += 1;
    }

    if (recommendedValue === true) {
      recommended.true += 1;
    } else if (recommendedValue === false) {
      recommended.false += 1;
    }
  });

  return [ratings, recommended];
};

const createCharacteristicsObj = (rows) => {
  const characteristics = {};
  const counts = {};

  rows.forEach((row) => {
    const name = row.name;
    if (!characteristics[name]) {
      characteristics[name] = {
        id: row.id,
        value: row.value,
      };

      counts[name] = {
        count: 1,
      };
    } else {
      characteristics[name].value += row.value;
      counts[name].count += 1;
    }
  });

  const charNames = Object.keys(characteristics);
  charNames.forEach((name) => {
    characteristics[name].value /= counts[name].count;
    characteristics[name].value = Math.round(characteristics[name].value).toFixed(4);
  });

  return characteristics;
};

module.exports = { createRatingsRecommendedObj, createCharacteristicsObj };
