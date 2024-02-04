const productsContent = document.querySelector(".products__content");
const btnBox = document.querySelector(".btn_box");
const btn = document.getElementById("product_btn");
const all = document.querySelector(".all");
const openModal = document.querySelector(".open_modal");
const modal = document.querySelector(".modal");
const closeModal = document.querySelector(".close_modal");
const modalBlock = document.querySelector(".modal__block");
const modalContent = document.querySelector(".modal__content");
const allBtn = document.querySelector("#all");
const electronicsBtn = document.querySelector("#electronics");
const menBtn = document.querySelector("#men");
const womenBtn = document.querySelector("#women");
const searchInput = document.querySelector(".search_input");
const count = document.querySelector(".modal__basket__text");
// storage

const getStorageData = () => {
  const result = JSON.parse(localStorage.getItem("product"));
  return result;
};

const addLocalStorage = (data) => {
  const oldData = getStorageData() || [];
  data.count = 1;
  const isIncluded = oldData.some((e) => e.id === data.id);
  if (oldData.length !== 0) {
    if (!isIncluded) {
      localStorage.setItem("product", JSON.stringify([...oldData, data]));
    }
  } else {
    localStorage.setItem("product", JSON.stringify([data]));
  }
};

// storage

{
  /* <div class="count__btn_block">
  <button class="minus_btn">-</button>
  <button class="" plus_btn>
    +
  </button>
</div>; */
}

// render
const renderModal = () => {
  const data = getStorageData();
  count.innerHTML = data.length;
  if (data) {
    modalBlock.innerHTML = data
      .map(
        (item) => `
    <div class="modal__card">
    <button class="delete_btn" data-id="${item.id}">x</button>
      <img class="modal__img" src="${item.image}"/>
      <h4 class="modal__title">${item.title}</h4>
      <p class="modal__price">$${Math.floor(item.price * item.discount)}</p>
      <div class="quantity_block">
        <button class="minus_btn" data-productid="${item.id}">-</button>
        <span class="quantity">${item.count}</span>
        <button class="plus_btn" data-productid="${item.id}">+</button>
      </div>
      <p class="total_price">Unit price: $${Math.floor(
        item.price * item.discount * item.count
      )}</p>
    </div>
    </div>
    `
      )
      .join("");
  }

  const element = document.createElement("span");
  element.textContent = "Total price: $" + Math.floor(calculateTotal(data));
  element.setAttribute("class", "modal_total");
  modalBlock.appendChild(element);
  minusButton();
  plusButton();
};
let currentData = [];
renderData = (data) => {
  productsContent.innerHTML = data
    .map((item) => {
      item.discount = 0.24;

      return `
       <div class="products__card">
          <img class="products__card__img" src="${item.image}"/>
          <h4 class="products__card__title">${
            item.title.length > 15
              ? item.title.slice(0, 15) + "..."
              : item.title
          }</h4>
          <img class="rate_img" src="../img/rate.svg" />
         <div class="price_block">
            <p class="products__card__text">$${item.price}</p>
            <p class="sale_price">$${Math.floor(item.price * item.discount)}</p>
            <p class="sale_percent">24% Off</p>
         </div>
          <button class="add_btn" data-id="${item.id}">add to cart</button>
       </div>
    `;
    })
    .join("");
};
// render

// request
const getData = async (category) => {
  try {
    const res = await fetch(
      `https://fakestoreapi.com/products/category/${category}`
    );
    const data = await res.json();
    renderData(data);
    currentData = data;
  } catch (error) {}
};
// getData();

const getAllData = async () => {
  try {
    const res = await fetch(`https://fakestoreapi.com/products`);
    const data = await res.json();
    renderData(data);
    currentData = data;
  } catch (error) {}
};
getAllData();

getSingleData = async (e) => {
  if (e.target.dataset.id) {
    try {
      const res = await fetch(
        `https://fakestoreapi.com/products/${e.target.dataset.id}`
      );
      const data = await res.json();
      data.discount = 0.24;
      addLocalStorage(data);
    } catch (error) {}
  }
};
// request

// event
productsContent.addEventListener("click", getSingleData);

const buttons = [allBtn, electronicsBtn, menBtn, womenBtn];
btnBox.addEventListener("click", (e) => {
  if (e.target.value) {
    getData(e.target.value);
  }
  activateTab(e);
});

const activateTab = (e) => {
  const id = e.target.id;
  const clickedBtn = buttons.find((button) => button.id == id);
  buttons.forEach((button) => {
    button.classList.remove("active_tab");
  });
  clickedBtn.classList.add("active_tab");
};

all.addEventListener("click", (e) => {
  e.stopPropagation();
  if (e.target.value) {
    getAllData(e.target.value);
  }
  activateTab(e);
});

openModal.addEventListener("click", () => {
  modal.classList.toggle("active");
  // document.body.style.overflow = "hidden";
  renderModal();
});

closeModal.addEventListener("click", () => {
  modal.classList.toggle("active");
  // document.body.style.overflow = "auto";
});

modal.addEventListener("click", () => {
  modal.classList.toggle("active");
});

modalContent.addEventListener("click", (e) => {
  e.stopPropagation();
});

modalBlock.addEventListener("click", (e) => {
  const id = Number(e.target.dataset.id);
  if (id) {
    const data = getStorageData();
    localStorage.setItem(
      "product",
      JSON.stringify(data.filter((item) => item.id !== id))
    );
  }
  renderModal();
});

searchInput.addEventListener("keydown", (e) => {
  const foundData = currentData.filter((item) => {
    return item.title.toLowerCase().includes(e.target.value.toLowerCase());
  });
  renderData(foundData);
});

// event

const minusButton = () => {
  const minusBtns = document.querySelectorAll(".minus_btn");
  const data = getStorageData();

  minusBtns.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.stopPropagation();

      localStorage.setItem(
        "product",
        JSON.stringify([
          ...data.map((product) => {
            if (product.id == e.target.dataset.productid) {
              if (product.count > 1) {
                product.count -= 1;
              }
            }
            return product;
          }),
        ])
      );

      renderModal();
    });
  });
};

const plusButton = () => {
  const plusBtns = document.querySelectorAll(".plus_btn");
  const data = getStorageData();

  plusBtns.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.stopPropagation();
      localStorage.setItem(
        "product",
        JSON.stringify([
          ...data.map((product) => {
            if (product.id == e.target.dataset.productid) {
              product.count += 1;
            }
            return product;
          }),
        ])
      );

      renderModal();
    });
  });
};

const calculateTotal = (data) => {
  let total = 0;
  data.forEach((product) => {
    total = total + product.price * product.count * product.discount;
  });
  return total;
};
