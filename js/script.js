const products = [
  {id:'arroz',name:'Arroz Selecto 95%',category:'basicos',label:'Productos basicos',description:'Grano seleccionado para todos los dias.',price:1450,image:'category-supermarket.svg'},
  {id:'frijoles',name:'Frijoles Rojos',category:'basicos',label:'Productos basicos',description:'Sabor tradicional para tu cocina.',price:1225,image:'category-supermarket.svg'},
  {id:'cafe',name:'Cafe de Tarrazu',category:'basicos',label:'Productos basicos',description:'Aroma intenso de Costa Rica.',price:3150,image:'category-supermarket.svg'},
  {id:'whisky',name:'Whisky Reserva',category:'licores',label:'Licores y bebidas',description:'Una opcion especial para brindar.',price:18900,image:'category-liquors.svg'},
  {id:'vino',name:'Vino Tinto Crianza',category:'licores',label:'Licores y bebidas',description:'Notas suaves y elegantes.',price:7650,image:'category-liquors.svg'},
  {id:'ron',name:'Ron Anejo',category:'licores',label:'Licores y bebidas',description:'Ideal para compartir.',price:8250,image:'category-liquors.svg'},
  {id:'coca',name:'Cola 2.5 L',category:'refrescos',label:'Bebidas y refrescos',description:'Refrescante para toda la familia.',price:1850,image:'category-drinks.svg'},
  {id:'agua',name:'Agua Cristal 1.5 L',category:'refrescos',label:'Bebidas y refrescos',description:'Hidratacion pura y practica.',price:850,image:'category-drinks.svg'},
  {id:'jugo',name:'Jugo de Naranja',category:'refrescos',label:'Bebidas y refrescos',description:'Sabor frutal para tu dia.',price:1300,image:'category-drinks.svg'},
  {id:'lays',name:"Papas Lay's",category:'snacks',label:'Snacks y antojos',description:'Crujientes, clasicas y deliciosas.',price:1650,image:'category-snacks.svg'},
  {id:'oreo',name:'Galletas Oreo',category:'snacks',label:'Snacks y antojos',description:'Un antojo para cualquier momento.',price:1480,image:'category-snacks.svg'},
  {id:'mani',name:'Mani Salado',category:'snacks',label:'Snacks y antojos',description:'El acompanante de una buena charla.',price:1100,image:'category-snacks.svg'}
];

const grid=document.querySelector('#product-grid');
const search=document.querySelector('#product-search');
const empty=document.querySelector('#empty-state');
const count=document.querySelector('#result-count');
const cartDrawer=document.querySelector('.cart-drawer');
const drawerOverlay=document.querySelector('.drawer-overlay');
const orderPhone='50660881222';
let activeFilter='todos';
let cart=JSON.parse(localStorage.getItem('encinales-cart')||'[]');
let latestOrder=null;

const money=value=>new Intl.NumberFormat('es-CR',{style:'currency',currency:'CRC',maximumFractionDigits:0}).format(value);
const imagePath=file=>`./assets/images/${file}`;
const cartDetails=()=>cart.map(entry=>({...products.find(product=>product.id===entry.id),quantity:entry.quantity})).filter(Boolean);

function renderProducts(){
  const term=search.value.trim().toLowerCase();
  const list=products.filter(product=>(activeFilter==='todos'||product.category===activeFilter)&&product.name.toLowerCase().includes(term));
  grid.innerHTML=list.map(product=>`<article class="product-card"><div class="product-image"><img src="${imagePath(product.image)}" alt="Ilustracion de ${product.name}"></div><div class="product-info"><span class="product-category">${product.label}</span><h3>${product.name}</h3><p>${product.description}</p><div class="product-bottom"><strong class="price">${money(product.price)}</strong><button class="add-button" type="button" data-add="${product.id}">Agregar</button></div></div></article>`).join('');
  empty.hidden=Boolean(list.length);
  count.textContent=`${list.length} producto${list.length===1?'':'s'} encontrado${list.length===1?'':'s'}`;
}

function saveCart(){localStorage.setItem('encinales-cart',JSON.stringify(cart));renderCart()}
function addItem(id){const item=cart.find(entry=>entry.id===id);if(item)item.quantity+=1;else cart.push({id,quantity:1});saveCart();openCart()}
function updateItem(id,amount){const item=cart.find(entry=>entry.id===id);if(!item)return;item.quantity+=amount;if(item.quantity<=0)cart=cart.filter(entry=>entry.id!==id);saveCart()}
function renderCart(){
  const items=document.querySelector('#cart-items');
  const detailed=cartDetails();
  items.innerHTML=detailed.map(product=>`<article class="cart-item"><img src="${imagePath(product.image)}" alt=""><div><h3>${product.name}</h3><p>${money(product.price)}</p><div class="quantity-controls"><button type="button" data-change="${product.id}" data-amount="-1" aria-label="Reducir cantidad de ${product.name}">&minus;</button><span>${product.quantity}</span><button type="button" data-change="${product.id}" data-amount="1" aria-label="Aumentar cantidad de ${product.name}">+</button></div></div><button class="remove-item" type="button" data-remove="${product.id}">Quitar</button></article>`).join('');
  const total=detailed.reduce((sum,product)=>sum+product.price*product.quantity,0);
  document.querySelector('#cart-subtotal').textContent=money(total);
  document.querySelector('#cart-total').textContent=money(total);
  document.querySelector('.cart-count').textContent=cart.reduce((sum,item)=>sum+item.quantity,0);
  document.querySelector('#cart-empty').hidden=detailed.length>0;
}

function openCart(){cartDrawer.classList.add('open');cartDrawer.setAttribute('aria-hidden','false');drawerOverlay.hidden=false}
function closeCart(){cartDrawer.classList.remove('open');cartDrawer.setAttribute('aria-hidden','true');drawerOverlay.hidden=true}
function openModal(id){const modal=document.querySelector(`#${id}`);modal.hidden=false;document.body.classList.add('modal-open');const target=modal.querySelector('input,button,a');if(target)target.focus()}
function closeModal(id){document.querySelector(`#${id}`).hidden=true;document.body.classList.remove('modal-open')}

function formatOrder(order){
  const divider='--------------------------------';
  const lines=['ORDEN DE PEDIDO','Minisuper y Licorera Encinales','',`Orden: #${order.number}`,`Fecha: ${order.date}`,`Hora: ${order.time}`,'',`Cliente: ${order.customer.name}`,`Telefono: ${order.customer.phone}`,`Entrega: ${order.customer.delivery}`];
  if(order.customer.address)lines.push(`Direccion: ${order.customer.address}`);
  lines.push('',divider,'');
  order.items.forEach(item=>lines.push(`${item.quantity}x ${item.name}`,`${money(item.price)} c/u`,`Subtotal: ${money(item.price*item.quantity)}`,''));
  lines.push(divider,`TOTAL: ${money(order.total)}`);
  return lines.join('\n');
}

function createOrder(form){
  const now=new Date();
  const delivery=form.elements.delivery.value;
  const items=cartDetails();
  const order={number:`ENC-${Math.floor(10000+Math.random()*90000)}`,date:now.toLocaleDateString('es-CR'),time:now.toLocaleTimeString('es-CR',{hour:'2-digit',minute:'2-digit'}),customer:{name:form.elements.name.value.trim(),phone:form.elements.phone.value.trim(),delivery,address:form.elements.address.value.trim()},items,total:items.reduce((sum,item)=>sum+item.price*item.quantity,0)};
  order.text=formatOrder(order);
  return order;
}

function copyOrder(){
  const done=()=>{document.querySelector('#copy-message').textContent='Orden copiada'};
  if(navigator.clipboard&&window.isSecureContext){navigator.clipboard.writeText(latestOrder.text).then(done).catch(fallbackCopy)}else{fallbackCopy()}
  function fallbackCopy(){const area=document.createElement('textarea');area.value=latestOrder.text;area.style.position='fixed';area.style.opacity='0';document.body.append(area);area.select();document.execCommand('copy');area.remove();done()}
}

document.addEventListener('click',event=>{
  const add=event.target.closest('[data-add]');if(add)addItem(add.dataset.add);
  const change=event.target.closest('[data-change]');if(change)updateItem(change.dataset.change,Number(change.dataset.amount));
  const remove=event.target.closest('[data-remove]');if(remove){cart=cart.filter(item=>item.id!==remove.dataset.remove);saveCart()}
  const filter=event.target.closest('[data-filter]');if(filter){activeFilter=filter.dataset.filter;document.querySelectorAll('.filter').forEach(button=>button.classList.toggle('active',button===filter));renderProducts()}
  const tile=event.target.closest('[data-category]');if(tile){activeFilter=tile.dataset.category;document.querySelectorAll('.filter').forEach(button=>button.classList.toggle('active',button.dataset.filter===activeFilter));document.querySelector('#productos').scrollIntoView({behavior:'smooth'});renderProducts()}
  const close=event.target.closest('[data-close-modal]');if(close)closeModal(close.dataset.closeModal);
});

search.addEventListener('input',renderProducts);
document.querySelector('#clear-filters').addEventListener('click',()=>{activeFilter='todos';search.value='';document.querySelectorAll('.filter').forEach(button=>button.classList.toggle('active',button.dataset.filter==='todos'));renderProducts()});
document.querySelector('.cart-trigger').addEventListener('click',openCart);
document.querySelector('.close-cart').addEventListener('click',closeCart);
drawerOverlay.addEventListener('click',closeCart);
document.querySelector('.search-trigger').addEventListener('click',()=>{document.querySelector('#productos').scrollIntoView({behavior:'smooth'});setTimeout(()=>search.focus(),500)});
document.querySelector('#checkout-button').addEventListener('click',()=>{if(!cart.length){document.querySelector('#checkout-message').textContent='Agrega al menos un producto para continuar.';return}document.querySelector('#checkout-message').textContent='';openModal('customer-modal')});

const customerForm=document.querySelector('#customer-form');
const addressField=document.querySelector('#address-field');
const addressInput=document.querySelector('#customer-address');
customerForm.addEventListener('change',event=>{if(event.target.name!=='delivery')return;const homeDelivery=customerForm.elements.delivery.value==='Entrega a domicilio';addressField.hidden=!homeDelivery;addressInput.required=homeDelivery;if(!homeDelivery)addressInput.value=''});
customerForm.addEventListener('submit',event=>{event.preventDefault();if(!customerForm.reportValidity())return;latestOrder=createOrder(customerForm);document.querySelector('#order-summary').textContent=latestOrder.text;document.querySelector('#send-whatsapp').href=`https://wa.me/${orderPhone}?text=${encodeURIComponent(latestOrder.text)}`;document.querySelector('#copy-message').textContent='';closeModal('customer-modal');closeCart();openModal('order-modal')});
document.querySelector('#copy-order').addEventListener('click',copyOrder);

const menu=document.querySelector('.menu-toggle');
const nav=document.querySelector('.main-nav');
menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',open);menu.setAttribute('aria-label',open?'Cerrar menu':'Abrir menu')});
nav.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false')});
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(element=>observer.observe(element));
renderProducts();renderCart();
