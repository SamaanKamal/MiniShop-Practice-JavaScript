class Product {
  // title = 'DEFAULT';
  // imageUrl;
  // description;
  // price;

  constructor(title, image, desc, price) {
    this.title = title;
    this.imageUrl = image;
    this.description = desc;
    this.price = price;
  }
}

class ElementAttribute{
  constructor(attributeName,attributeValue){
    this.name = attributeName;
    this.value = attributeValue;
  }
}

class Component{
  constructor(renderHookID,shouldRender = true){
    this.hookID = renderHookID;
    if(shouldRender)
    {
      this.render();
    }
  }
  render(){

  }

  createRootElement(tag,cssClasses,attirbutes){
    const rootElemnt = document.createElement(tag);
    if(cssClasses)
    {
      rootElemnt.className = cssClasses;
    }
    if(attirbutes && attirbutes.length>0)
    {
      for(const attribute of attirbutes)
      {
        rootElemnt.setAttribute(attribute.name,attribute.value);
      }
    }
    document.getElementById(this.hookID).append(rootElemnt);
    return rootElemnt;
  }
}

class ProductList extends Component{
  #products = [];
    

  constructor(renderHookID){
    super(renderHookID,false);
    this.render();
    this.#fetchProducts();
  }

  #fetchProducts(){
    this.#products=[
    new Product(
      'A Pillow',
      'https://www.maxpixel.net/static/photo/2x/Soft-Pillow-Green-Decoration-Deco-Snuggle-1241878.jpg',
      'A soft pillow!',
      19.99
    ),
    new Product(
      'A Carpet',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Ardabil_Carpet.jpg/397px-Ardabil_Carpet.jpg',
      'A carpet which you might like - or not.',
      89.99
    )
    ];
    this.renderProducts();
  }

  renderProducts()
  {
    for (const prod of this.#products)
    {
      new ProductItem(prod,'prod-list');
    }
  }
  render() {
    this.createRootElement('ul','product-list',[new ElementAttribute('id','prod-list')]);
    if(this.#products && this.#products.length > 0)
    {
      this.renderProducts();
    }
  }
  
}

class ProductItem extends Component{

  constructor(product,renderHookID)
  {
    super(renderHookID,false);
    this.product= product;
    this.render();
  }

  addToCart(){
    App.addProductToCart(this.product);
  }

  render()
  {
    const prodEl = this.createRootElement('li','product-item');
    prodEl.innerHTML = `
    <div>
      <img src="${this.product.imageUrl}" alt="${this.product.title}" >
      <div class="product-item__content">
        <h2>${this.product.title}</h2>
        <h3>\$${this.product.price}</h3>
        <p>${this.product.description}</p>
        <button>Add to Cart</button>
      </div>
    </div>
  `;
  const addCartButtron= prodEl.querySelector('button');
  addCartButtron.addEventListener('click',this.addToCart.bind(this));
  }
  
}


class ShoppingCart extends Component{
  items =[];

  constructor(renderHookID){
    super(renderHookID,false);
    this.orderProducts = () =>{
      console.log(this.items);
    }
    this.render();
  }

  set cartItems(value){
    this.items = value;
    this.totalOutput.innerHTML = `<h2>Total: \$${this.totalAmout.toFixed(2)}</h2>`;
  }

  get totalAmout(){
    const sum = this.items.reduce((previousValue,currentitem,) =>{
      return previousValue+currentitem.price;
    },0)
    return sum;
  }

  addProduct (product){
    const updatedItems = [...this.items];
    updatedItems.push(product);
    this.cartItems = updatedItems;
  }

  render(){
    const cartEl =this.createRootElement('section','cart')
    cartEl.innerHTML = `
    <h2>Total: \$${0}</h2>
    <button>Order Now!</button>
    `; 
    const orderButton = cartEl.querySelector('button');
    orderButton.addEventListener('click',this.orderProducts.bind(this));
    this.totalOutput = cartEl.querySelector('h2');
  }
}

class Shop extends Component{
  constructor(){
    super();
  }
  render(){
    this.shoppingCart=new ShoppingCart('app');
    new ProductList('app');
    
  }
}

class App{
  static cart;

  static init(){
    const shop = new Shop();
    this.cart = shop.shoppingCart;
  }

  static addProductToCart(product){
    this.cart.addProduct(product);
  }
}

App.init();




 