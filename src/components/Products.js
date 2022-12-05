import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
  Button,
  Stack
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
import ProductCard from "./ProductCard";
import { PermDeviceInformationRounded } from "@mui/icons-material";
import Cart from "./Cart";
import {generateCartItemsFrom} from "./Cart";
// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 * 
 * @property {string} name - The name or title of the product


/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 * 
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */


const Products = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading,setIsLoading]=useState(false);
  const [timerId,setTimerId]=useState("");
  const [products,setProducts]=useState([]);
  const [fetchedCartItems,setFetchedCartItems]=useState([]);

  //use effect to set products values by making an api call
  
  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */
  const performAPICall = async () => {
    setIsLoading(true);
    try{
      let res=await axios.get(`${config.endpoint}/products`);
      setIsLoading(false);
      setProducts(res.data);
      return res.data;
    }catch(err){
      setIsLoading(false);
      enqueueSnackbar(err.response.data.message, { variant: "error" });
    }
  };
  let token=localStorage.getItem("token");
  useEffect(()=>{
    (async()=>{
      let products=await performAPICall();
      if(localStorage.getItem("token")){
        let items=await fetchCart(token);
        let completeProductsList=await generateCartItemsFrom(items,products);
        setFetchedCartItems(completeProductsList);
      }
    })();
    
  },[]);
  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const performSearch = async (text) => {
    try{
      let res=await axios.get(`${config.endpoint}/products/search?value=${text}`)
      setProducts(res.data);
    }
    catch{
      setProducts([]);
    }
    
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
  const debounceSearch = (e,event, debounceTimeout) => {
   clearTimeout(timerId);
   setTimerId(setTimeout(()=>{event(e.target.value)},debounceTimeout));
  };
  // const productsInfo=
  // {
  // "name":"Tan Leatherette Weekender Duffle",
  // "category":"Fashion",
  // "cost":150,
  // "rating":4,
  // "image":"https://crio-directus-assets.s3.ap-south-1.amazonaws.com/ff071a1c-1099-48f9-9b03-f858ccc53832.png",
  // "_id":"PmInA797xJhMIPti"
  // };

  /**
   * Perform the API call to fetch the user's cart and return the response
   *
   * @param {string} token - Authentication token returned on login
   *
   * @returns { Array.<{ productId: string, qty: number }> | null }
   *    The response JSON object
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 401
   * {
   *      "success": false,
   *      "message": "Protected route, Oauth2 Bearer token not found"
   * }
   */
   const fetchCart = async (token) => {
    if (!token) return;

    try {
      // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
      let res=await axios.get(`${config.endpoint}/cart`,{headers:{Authorization:`Bearer ${token}`}});
      // setFetchedCartItems(res.data);
      return res.data;
    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
      return null;
    }
  };


  // TODO: CRIO_TASK_MODULE_CART - Return if a product already exists in the cart
  /**
   * Return if a product already is present in the cart
   *
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { String } productId
   *    Id of a product to be checked
   *
   * @returns { Boolean }
   *    Whether a product of given "productId" exists in the "items" array
   *
   */
  const isItemInCart = (items, productId) => {
    const isPresent=items.find(item=>item.productId===productId);
    if(isPresent){
      return true;
    }
    return false;
  };

  /**
   * Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
   *
   * @param {string} token
   *    Authentication token returned on login
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { Array.<Product> } products
   *    Array of objects with complete data on all available products
   * @param {string} productId
   *    ID of the product that is to be added or updated in cart
   * @param {number} qty
   *    How many of the product should be in the cart
   * @param {boolean} options
   *    If this function was triggered from the product card's "Add to Cart" button
   *
   * Example for successful response from backend:
   * HTTP 200 - Updated list of cart items
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 404 - On invalid productId
   * {
   *      "success": false,
   *      "message": "Product doesn't exist"
   * }
   */
  const addToCart = async (
    token,
    items,
    products,
    productId,
    qty=1,
    options = { preventDuplicate: false }
  ) => {
    if(!token) {
      enqueueSnackbar("Login to add an item to the Cart",{variant:"warning"});
      return;
    };
    if(options.preventDuplicate && isItemInCart(items,productId)){
      enqueueSnackbar("Item already in cart. Use the cart sidebar to update quantity or remove item.",{variant:"warning"});
      return;
    }
    let res=await axios.post(`${config.endpoint}/cart`,{productId,qty},{headers:{'Authorization': `Bearer ${token}`}});
    let newData=generateCartItemsFrom(res.data,products);
    setFetchedCartItems(newData);
  };


  const childrenComponent=<TextField
  className="search-desktop"
  size="small"
  InputProps={{
    endAdornment: (
      <InputAdornment position="end">
        <Search color="primary" />
      </InputAdornment>
    ),
  }}
  placeholder="Search for items/categories"
  name="search"
  onChange={(e)=>debounceSearch(e,performSearch,500)}
  />


let userName=localStorage.getItem("username");


//handleQuantity
const handleQuantity=(token,
  items,
  products,
  productId,
  qty)=>{
    addToCart(token,items,products,productId,qty);
}
  return (
    <div>
      <Header>
        {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}
      {childrenComponent}
      </Header>

      {/* Search view for mobiles */}
      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
        onChange={(e)=>debounceSearch(e,performSearch,500)}
      />
      
       <Grid container>
         <Grid item xs={12} md={userName?8:12} lg={userName?9:12}>
          <Grid item className="product-grid">
           <Box className="hero">
             <p className="hero-heading">
               India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
               to your door step
             </p>
           </Box>
          </Grid>
          <Grid  container p={2} direction="row" justifyContent="center" rowSpacing={1} columnSpacing={1} className="productsGrid">
            {isLoading ?
             <Stack sx={{minHeight:500}} justifyContent="center">
              <Button><CircularProgress sx={{color:"#00a278"}} /></Button>
              Loading Products...
             </Stack>
             :
               products.length===0 ? 
                <Stack sx={{minHeight:500}} justifyContent="center">
                  <Button><SentimentDissatisfied style={{color:"#808080"}}/></Button>
                  <p style={{color:"#808080"}}>No products found</p>
                </Stack>
               :
               products.map((productsInfo)=>{
                return(<Grid className="innerGrid" item p={2} xs={10} sm={6} md={4} lg={3}  key={productsInfo._id}>
                  <ProductCard product={productsInfo} handleAddToCart={addToCart} items={fetchedCartItems} products={products} token={localStorage.getItem("token")}/>
                 </Grid>)
               })
            }
         </Grid>
        </Grid>
        {userName && <Grid item xs={12} md={4} lg={3}  className="cartBackground">
          <Cart products={products} items={fetchedCartItems} token={localStorage.getItem("token")} handleQuantity={handleQuantity}/>
        </Grid>}
       </Grid>
      <Footer />
    </div>
  );
};

export default Products;
