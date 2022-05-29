let carrito = {};
const carritoModal = document.querySelector(".cart-modal-overlay");
const cart = document.querySelector("#cart");
const templateFooter = document.getElementById("template-footer").content;
const templateCarrito = document.getElementById("template-carrito").content;
const templateCard = document.getElementById("templateCard").content;
const closeBtn = document.querySelector("#close-btn");
const cards = document.getElementById("cards");
const items = document.getElementById("items");
const fragment = document.createDocumentFragment();
const footer = document.getElementById("footer");
const contadorCarrito = document.getElementsByClassName("contadorCarrito");



//1- Agrego las cards con los productos

//1-1 capturo los datos
document.addEventListener("DOMContentLoaded", ()=>{
    fetchData();
    if (localStorage.getItem("datos")){
        carrito = JSON.parse(localStorage.getItem("datos"))
        pintarCarrito()
    }
})

const fetchData =async() => {
    try{
            const respuesta = await fetch("json/productos.json");
            const data = await respuesta.json();
            pintarCards(data)
    }
    catch (error){
        console.log(error)
    }
}

const pintarCards = data => {
    data.forEach(productos =>{
        templateCard.querySelector(".titulo").textContent = productos.texto;
        templateCard.querySelector(".precioProducto").textContent = productos.precio;
        templateCard.querySelector(".prodImagen").setAttribute ("src", productos.imagen);
        templateCard.querySelector(".agregarAlCarrito").dataset.id = productos.id;
        const clone = templateCard.cloneNode(true);
        fragment.appendChild(clone)
    })

    cards.appendChild(fragment);
}



// //accion de abrir el carrito

cart.addEventListener("click", () =>{
    carritoModal.classList.add("open");
 }   )

// //accion de cerrar el carrito


closeBtn.addEventListener("click", () =>{
    carritoModal.classList.remove("open");
}   )

 carritoModal.addEventListener("click", (e)=>{
    if(e.target.classList.contains("cart-modal-overlay")){
         carritoModal.classList.remove("open");

    }
 })

//Asignar a cada boton su funcion

cards.addEventListener("click", e =>{
    agregarCarrito (e)
})

items.addEventListener("click", e=>{
    btnAccion(e)
})

const agregarCarrito = e =>{
    


    if (e.target.classList.contains("agregarAlCarrito")) {
        
        setCarrito (e.target.parentElement);
        
    }
    e.stopPropagation()
}
const setCarrito = objeto =>{
    
    const elementos ={
    id: objeto.querySelector(".agregarAlCarrito").dataset.id,
    texto: objeto.querySelector(".titulo").textContent,
    precio: objeto.querySelector (".precioProducto").textContent,
    cantidad: 1
}
if (carrito.hasOwnProperty(elementos.id)) {
    elementos.cantidad = carrito[elementos.id].cantidad + 1;
}
carrito[elementos.id] = {...elementos}

pintarCarrito()
}

//armo el carrito
const pintarCarrito = () => {
    
    items.innerHTML ="";
    Object.values(carrito).forEach(elementos =>{
        templateCarrito.querySelector(".th").textContent = elementos.id;
        templateCarrito.querySelector(".td").textContent = elementos.texto;
        templateCarrito.querySelector(".td2").textContent = elementos.cantidad;
        templateCarrito.querySelector(".boton1").dataset.id = elementos.id;
        templateCarrito.querySelector(".boton2").dataset.id = elementos.id;
        templateCarrito.querySelector(".span").textContent = elementos.cantidad * elementos.precio;

        const clone = templateCarrito.cloneNode(true);
        fragment.appendChild(clone)
         
    })

    items.appendChild(fragment);

    pintarFooter();

    localStorage.setItem("datos",JSON.stringify(carrito));

}

const pintarFooter = () => {
    footer.innerHTML = "";
    if (Object.keys(carrito).length === 0){
        footer.innerHTML =`<th class="text-center" scope="row" colspan="5">Carrito vacío</th>`
    return
    }
    const nCantidad = Object.values(carrito).reduce((acc,{cantidad}) => acc + cantidad,0);
    const nPrecio = Object.values(carrito).reduce((acc,{cantidad, precio}) => acc + cantidad * precio,0);
    

    templateFooter.querySelectorAll("td")[0].textContent = nCantidad;
    templateFooter.querySelector("span").textContent = nPrecio;
    cart.querySelector(".contadorCarrito").textContent = nCantidad;
    

    const clone = templateFooter.cloneNode(true);
    fragment.appendChild(clone);
    footer.appendChild(fragment);

    
    //Vaciar carrito

    const botonVaciar = document.querySelector('#vaciar');

    botonVaciar.addEventListener("click", () => {

        swal("¿Vaciar carrito?", {
            buttons: {
                cancel: "Si, vaciar",
                catch: {
                    text: "No",
                    value: "mantiene",
                },
            },
        })
            .then((value) => {
                switch (value) {
    
                    case "mantiene":
                        break;
    
                    default:
                        swal("Carrito vacio");
                        carrito = {};
                        pintarCarrito();
                        cart.querySelector(".contadorCarrito").textContent = 0;
                }
            });
    
    });
    
    //Comparar-finalizar compra 

    const finalizarCompra = document.getElementById("finalizarCompra");
    finalizarCompra.addEventListener("click", () => {

        carrito = {};
        pintarCarrito();
        cart.querySelector(".contadorCarrito").textContent = 0;
        swal("Gracias por su compra", "Pago realizado con Exito!", "success");
    });
    
}

//agregar-restar cantidad del producto

const btnAccion = e => {
    
    if(e.target.classList.contains("boton1")){
        
        const producto = carrito[e.target.dataset.id];
        producto.cantidad = carrito[e.target.dataset.id].cantidad + 1;
        carrito[e.target.dataset.id] = {...producto};

        pintarCarrito();
    }

    if(e.target.classList.contains("boton2")){
        const producto = carrito[e.target.dataset.id];
        producto.cantidad = carrito[e.target.dataset.id].cantidad - 1;

        if (producto.cantidad == 0){
            delete carrito[e.target.dataset.id];
        }

        pintarCarrito();
    }
    e.stopPropagation()
}


//contador del carrito

const pintarContador = () => {
    carrito = {};
    pintarCarrito();
    const nCantidad = Object.values(carrito).reduce((acc,{cantidad}) => acc + cantidad,0);
    cart.querySelector(".contadorCarrito").textContent = nCantidad;
    }

