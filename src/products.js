const products = [
  // placeholder images from picsum.photos
  { id: 1, name: "[product name]", product_url: "https://www.ssense.com/en-us/women/product/lemaire/beige-printed-paneled-midi-dress/19437631", description: "X", image: "https://img.ssensemedia.com/image/upload/b_white,c_lpad,g_south,ar_2:3/f_auto,c_limit,w_480,q_85/262268M192003_1.jpg", price: "$10.00" },
  { id: 2, name: "[product name]", product_url: "https://www.ssense.com/en-us/women/product/lemaire/beige-printed-paneled-midi-dress/19437631", description: "X", image: "https://img.ssensemedia.com/image/upload/b_white,c_lpad,g_south,ar_2:3/f_auto,c_limit,w_480,q_85/262236F093000_1.jpg", price: "$10.00" },
  { id: 3, name: "[product name]", product_url: "https://www.ssense.com/en-us/women/product/lemaire/beige-printed-paneled-midi-dress/19437631", description: "X", image: "https://img.ssensemedia.com/image/upload/b_white,c_lpad,g_south,ar_2:3/f_auto,c_limit,w_384,q_85/261129F069027_1.jpg", price: "$10.00" },
  { id: 4, name: "[product name]", product_url: "https://www.ssense.com/en-us/women/product/lemaire/beige-printed-paneled-midi-dress/19437631", description: "X", image: "https://img.ssensemedia.com/image/upload/b_white,c_lpad,g_south,ar_2:3/f_auto,c_limit,w_480,q_85/262236F110010_1.jpg", price: "$10.00" },
  { id: 5, name: "[product name]", product_url: "https://www.ssense.com/en-us/women/product/lemaire/beige-printed-paneled-midi-dress/19437631", description: "X", image: "https://img.ssensemedia.com/image/upload/b_white,c_lpad,g_south,ar_2:3/f_auto,c_limit,w_384,q_85/262236F054013_1.jpg", price: "$10.00" },
  { id: 6, name: "[product name]", product_url: "https://www.ssense.com/en-us/women/product/lemaire/beige-printed-paneled-midi-dress/19437631", description: "X", image: "https://img.ssensemedia.com/image/upload/b_white,c_lpad,g_south,ar_2:3/f_auto,c_limit,w_384,q_85/262236F054007_1.jpg", price: "$10.00" },
  { id: 7, name: "[product name]", product_url: "https://www.ssense.com/en-us/women/product/lemaire/beige-printed-paneled-midi-dress/19437631", description: "X", image: "https://img.ssensemedia.com/image/upload/b_white,c_lpad,g_south,ar_2:3/f_auto,c_limit,w_480,q_85/262600F062001_1.jpg", price: "$10.00" },
  { id: 8, name: "[product name]", product_url: "https://www.ssense.com/en-us/women/product/lemaire/beige-printed-paneled-midi-dress/19437631", description: "X", image: "https://img.ssensemedia.com/image/upload/b_white,c_lpad,g_south,ar_2:3/f_auto,c_limit,w_480,q_85/261187F060001_1.jpg", price: "$10.00" },
  { id: 9, name: "[product name]", product_url: "https://www.ssense.com/en-us/women/product/lemaire/beige-printed-paneled-midi-dress/19437631", description: "X", image: "https://img.ssensemedia.com/image/upload/b_white,c_lpad,g_south,ar_2:3/f_auto,c_limit,w_384,q_85/261314F109021_1.jpg", price: "$10.00" },
  { id: 10, name: "[product name]", product_url: "https://www.ssense.com/en-us/women/product/lemaire/beige-printed-paneled-midi-dress/19437631", description: "X", image: "https://img.ssensemedia.com/image/upload/b_white,c_lpad,g_south,ar_2:3/f_auto,c_limit,w_384,q_85/262581F100004_1.jpg", price: "$10.00" },
  { id: 11, name: "[product name]", product_url: "https://www.ssense.com/en-us/women/product/lemaire/beige-printed-paneled-midi-dress/19437631", description: "X", image: "https://img.ssensemedia.com/image/upload/b_white,c_lpad,g_south,ar_2:3/f_auto,c_limit,w_480,q_85/262260M201005_1.jpg", price: "$10.00" },
  { id: 12, name: "[product name]", product_url: "https://www.ssense.com/en-us/women/product/lemaire/beige-printed-paneled-midi-dress/19437631", description: "X", image: "https://img.ssensemedia.com/image/upload/b_white,c_lpad,g_south,ar_2:3/f_auto,c_limit,w_480,q_85/262487M202000_1.jpg", price: "$10.00" },
  { id: 13, name: "[product name]", product_url: "https://www.ssense.com/en-us/women/product/lemaire/beige-printed-paneled-midi-dress/19437631", description: "X", image: "https://img.ssensemedia.com/image/upload/b_white,c_lpad,g_south,ar_2:3/f_auto,c_limit,w_384,q_85/262154F110006_1.jpg", price: "$10.00" },
  { id: 14, name: "[product name]", product_url: "https://www.ssense.com/en-us/women/product/lemaire/beige-printed-paneled-midi-dress/19437631",  description: "X", image: "https://img.ssensemedia.com/image/upload/b_white,c_lpad,g_south,ar_2:3/f_auto,c_limit,w_384,q_85/262236F052002_1.jpg", price: "$10.00" },
  { id: 15, name: "[product name]", product_url: "https://www.ssense.com/en-us/women/product/lemaire/beige-printed-paneled-midi-dress/19437631", description: "X", image: "https://img.ssensemedia.com/image/upload/b_white,c_lpad,g_south,ar_2:3/f_auto,c_limit,w_384,q_85/262236F110010_1.jpg", price: "$10.00" },
  { id: 16, name: "[product name]", product_url: "https://www.ssense.com/en-us/women/product/lemaire/beige-printed-paneled-midi-dress/19437631", description: "X", image: "https://img.ssensemedia.com/image/upload/b_white,c_lpad,g_south,ar_2:3/f_auto,c_limit,w_384,q_85/262236F059000_1.jpg", price: "$10.00" },
];

const SIMULATE_ERROR = false;

// FOR SCRAPPER - reference code:
// girl I don't know
// export async function fetchProducts() {
//   const response = await fetch("http://localhost:3000/api/products");
//   if (!response.ok) throw new Error("Failed");
//   return response.json();
// }

export function fetchProducts() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (SIMULATE_ERROR) {
        reject(new Error("Failed"));
      } else {
        resolve(products);
      }
    }, 500);
  });
}


export default products;

