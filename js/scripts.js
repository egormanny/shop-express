// ССЫЛКА НА API https://fakestoreapi.com
// Получение 1-ого товара: https://fakestoreapi.com/products/1

const catalogElem = document.getElementById("catalog");
const cartCounter = document.getElementById("cart-counter");
const cartButton = document.getElementById("cart-button");
const cartElem = document.getElementById("cart-content");

const cart = [];

renderCartCount();

cartButton.addEventListener("click", function (event) {
  event.preventDefault();
  renderCart();
});

function render(products) {
  for (let i = 0; i < products.length; i++) {
    const productCard = document.createElement("div");
    productCard.className = "col mb-5";

    const productCardContainer = document.createElement("div");
    productCardContainer.className = "card h-100";

    const productImage = document.createElement("img");
    productImage.className = "card-img-top";
    productImage.style.height = "300px";
    productImage.style.objectFit = "contain";
    productImage.src = products[i].image;

    const productDetails = document.createElement("div");
    productDetails.className = "card-body p-4";

    const detailsText = document.createElement("div");
    detailsText.className = "text-center";

    const productName = document.createElement("h5");
    productName.className = "fw-bolder";
    productName.innerText = products[i].title;

    const productPrice = document.createElement("span");
    productPrice.innerText = "$ " + products[i].price;

    const productActions = document.createElement("div");
    productActions.className =
      "card-footer p-4 pt-0 border-top-0 bg-transparent";

    const actionsText = document.createElement("div");
    actionsText.className = "text-center";

    const productAddToCardButton = document.createElement("button");
    productAddToCardButton.setAttribute("type", "button");
    productAddToCardButton.className = "btn btn-success";
    productAddToCardButton.innerText = "Add To Cart";

    productAddToCardButton.addEventListener("click", function () {
      cart.push({
        ...products[i],
        qnt: 1,
      });
      renderCartCount();
    });

    actionsText.appendChild(productAddToCardButton);
    productActions.appendChild(actionsText);

    detailsText.appendChild(productName);
    detailsText.appendChild(productPrice);
    productDetails.appendChild(detailsText);

    productCardContainer.appendChild(productImage);
    productCardContainer.appendChild(productDetails);
    productCardContainer.appendChild(productActions);
    productCard.appendChild(productCardContainer);

    catalogElem.appendChild(productCard);
  }
}

function renderProductCounter(productQnt, productId) {
  const counterContainer = document.createElement("div");
  counterContainer.className = "container mt-4";

  const qntContainer = document.createElement("div");
  qntContainer.className = "col-md-2 text-center";
  qntContainer.innerText = productQnt;

  const rowContainer = document.createElement("div");
  rowContainer.className = "row justify-items-center align-items-center";

  const decrContainer = document.createElement("div");
  decrContainer.className = "col-md-2";

  const decrButton = document.createElement("button");
  decrButton.className = "btn btn-primary btn-sm";

  if (productQnt === 1) {
    decrButton.setAttribute("disabled", true);
  }
  decrButton.addEventListener("click", function () {
    const productIdx = cart.findIndex(function (product) {
      return product.id === productId;
    });

    if (cart[productIdx].qnt > 1) {
      cart[productIdx].qnt -= 1;
      qntContainer.innerText = cart[productIdx].qnt;
    }

    if (cart[productIdx].qnt === 1) {
      decrButton.setAttribute("disabled", true);
    }

    renderCartCount();
  });

  const decrIcon = document.createElement("i");
  decrIcon.className = "bi bi-dash";

  decrButton.appendChild(decrIcon);
  decrContainer.appendChild(decrButton);

  const incrButton = document.createElement("button");
  incrButton.className = "btn btn-primary btn-sm";
  incrButton.addEventListener("click", function () {
    const productIdx = cart.findIndex(function (product) {
      return product.id === productId;
    });

    cart[productIdx].qnt += 1;
    decrButton.removeAttribute("disabled");
    qntContainer.innerText = cart[productIdx].qnt;

    renderCartCount();
  });

  const incrIcon = document.createElement("i");
  incrIcon.className = "bi bi-plus";

  const incrContainer = document.createElement("div");
  incrContainer.className = "col-md-2";

  incrButton.appendChild(incrIcon);
  incrContainer.appendChild(incrButton);

  rowContainer.appendChild(decrContainer);
  rowContainer.appendChild(qntContainer);
  rowContainer.appendChild(incrContainer);

  counterContainer.appendChild(rowContainer);

  return counterContainer;
}

function renderCart() {
  if (cart.length === 0) {
    cartElem.innerText = "Cart Is Empty";
    return;
  }

  cartElem.innerText = "";

  for (let i = 0; i < cart.length; i++) {
    const productCard = document.createElement("div");
    productCard.className = "card mb-3";

    const productCardContainer = document.createElement("div");
    productCardContainer.className = "row g-0 p-2 align-center";

    const productImageWrapper = document.createElement("div");
    productImageWrapper.className = "col-md-2";

    const productImage = document.createElement("img");
    productImage.className = "img-fluid rounded-start";
    productImage.style.height = "100px";
    productImage.style.objectFit = "contain";
    productImage.src = cart[i].image;

    const productDetailsWrapper = document.createElement("div");
    productDetailsWrapper.className = "col-md-8";

    const productActionsWrapper = document.createElement("div");
    productActionsWrapper.className = "col-md-2 align-self-center text-center";

    const productDeleteButton = document.createElement("button");
    productDeleteButton.className = "btn btn-danger";

    productDeleteButton.addEventListener("click", function () {
      cart.splice(i, 1);
      renderCart();
      renderCartCount();
    });

    const productDeleteIcon = document.createElement("i");
    productDeleteIcon.className = "bi bi-trash-fill";

    const productDetails = document.createElement("div");
    productDetails.className = "card-body";

    const productName = document.createElement("h6");
    productName.className = "card-title text-center";
    productName.innerText = cart[i].title;

    const counterElement = renderProductCounter(cart[i].qnt, cart[i].id);

    productDetailsWrapper.appendChild(productName);
    productDetailsWrapper.appendChild(counterElement);
    productImageWrapper.appendChild(productImage);

    productDeleteButton.appendChild(productDeleteIcon);
    productActionsWrapper.appendChild(productDeleteButton);

    productCardContainer.appendChild(productImageWrapper);
    productCardContainer.appendChild(productDetailsWrapper);
    productCardContainer.appendChild(productActionsWrapper);
    // productCardContainer.appendChild(productActions);
    productCard.appendChild(productCardContainer);

    cartElem.appendChild(productCard);
  }
}

function renderCartCount() {
  const qnt = cart.reduce(function (acc, product) {
    acc += product.qnt;

    return acc;
  }, 0);

  cartCounter.innerText = qnt;
}

axios
  .get("https://fakestoreapi.com/products")
  .then(function (res) {
    render(res.data);
  })
  .catch(function (err) {
    console.log(err);
  });
