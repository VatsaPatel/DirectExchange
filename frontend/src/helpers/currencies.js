export const currencyList = [
  { name: "US Dollar", code: "USD" },
  { name: "Euro", code: "EUR" },
  { name: "Indian Rupee", code: "INR" },
  { name: "British Pound", code: "GBP" },
  { name: "Chinese Renminbi", code: "RMB" },
];

var currency_countries = Object();

currency_countries["USD"] =
  "|United States|American Samoa|British Virgin Islands|Ecuador|El Salvador|Guam|East Timor|Marshall Islands|Puerto Rico|Virgin Islands";

currency_countries["INR"] = "|India";

currency_countries["RMB"] = "|China";

currency_countries["GBP"] = "|United Kingdom";

currency_countries["EUR"] =
  "|Netherlands|Andorra|Belgium|Spain|Guadeloupe|Ireland|Italy|Austria|Greece|Cyprus|Latvia|Lithuania|Luxembourg|Malta|Martinique|Mayotte|Monaco|Portugal|France|French Guiana|Reunion|Saint Pierre and Miquelon|Germany|San Marino|Slovakia|Slovenia|Finland|Vatican City|Estonia|French Southern and Antarctic Lands|Montenegro|Saint Barthelemy|Kosovo|Åland Islands|Saint Martin";

export const countries = currency_countries;
