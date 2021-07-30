const createRatingsRecommendedObj = (rows) => {
  const ratings = {};
  const recommended = {
    true: 0,
    false: 0,
  };

  rows.forEach((row) => {
    // eslint-disable-next-line prefer-destructuring
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
    // eslint-disable-next-line prefer-destructuring
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

const createUpdatePhotosQuery = (reviewId, photosArray) => {
  let updatePhotosValues = '';

  photosArray.forEach((photoURL) => {
    updatePhotosValues += `(${reviewId}, '${photoURL}'), `;
  });
  updatePhotosValues = updatePhotosValues.slice(0, -2);

  const updatePhotosQuery = `INSERT INTO photos(review_id, url) VALUES${updatePhotosValues}`;
  return updatePhotosQuery;
};

const createUpdateCharacteristicsReviewsQuery = (reviewId, characteristicsObject) => {
  let updateCharacteristicsReviewsValues = '';
  const characteristicsKeys = Object.keys(characteristicsObject);

  characteristicsKeys.forEach((key) => {
    updateCharacteristicsReviewsValues += `(${key}, ${reviewId}, ${characteristicsObject[key]}), `;
  });
  updateCharacteristicsReviewsValues = updateCharacteristicsReviewsValues.slice(0, -2);

  const updateCharacteristicsReviewsQuery = `INSERT INTO characteristics_reviews(characteristic_id, review_id, value) VALUES${updateCharacteristicsReviewsValues}`;
  return updateCharacteristicsReviewsQuery;
};

module.exports = {
  createRatingsRecommendedObj,
  createCharacteristicsObj,
  createUpdatePhotosQuery,
  createUpdateCharacteristicsReviewsQuery,
};
