/** Provinces = top-level cities that have children. */
export function getProvinces(cities = []) {
  if (!Array.isArray(cities)) return [];
  return cities.filter(
    (city) =>
      city &&
      (city.ParentId == null || city.ParentId === undefined) &&
      Array.isArray(city.ChildrenCities) &&
      city.ChildrenCities.length > 0
  );
}

export function findCityById(cities = [], cityId) {
  if (!Array.isArray(cities) || cityId == null || cityId === '') return null;
  const id = Number(cityId);

  for (const province of getProvinces(cities)) {
    const child = province.ChildrenCities?.find((c) => Number(c.CityId) === id);
    if (child) {
      return { ...child, ProvinceName: province.CityName, ProvinceId: province.CityId };
    }
  }

  return cities.find((c) => Number(c.CityId) === id) || null;
}

export function findProvinceIdForCity(cities = [], cityId) {
  const found = findCityById(cities, cityId);
  return found?.ProvinceId ?? found?.ParentId ?? '';
}
