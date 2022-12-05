import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import React from "react";
import "./ProductCard.css";
import AddShoppingCartSharpIcon from '@mui/icons-material/AddShoppingCartSharp';

const ProductCard = ({ product, handleAddToCart,items,products,token}) => {
  return (
    <Card className="card" sx={{maxWidth:330}}>
     <CardMedia
        component="img"
        image={product.image}
        alt={product.name}
        id={product._id}
        aria-label="stars"
      />
      <CardContent className="cardContent">
        <Typography gutterBottom>{product.name}</Typography>
        <Typography gutterBottom variant="p" component="p" sx={{fontWeight:"600",fontSize:"5"}}>
          ${product.cost}
        </Typography>
        <Rating
        name="simple-controlled"
        value={product.rating}/>
        </CardContent>
        <CardActions>
        <Button  fullWidth size="small" variant="contained" onClick={()=>handleAddToCart(token,items,products,product._id,1,{preventDuplicate:true})} ><AddShoppingCartSharpIcon/>ADD TO CART</Button>
        </CardActions>
    </Card>
  );
};

export default ProductCard;
