import axios from 'axios';
import { useState, useEffect} from 'react'



const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

function App() {
  const [tempProduct, setTempProduct] = useState({});


  const [account, setAccount] = useState({
    username: "example@test.com",
    password: "example"
  })

  //設定是否登入成功跳轉畫面開關
  const [isToken, setIsToken] = useState(()=>{
    const cookies = document.cookie.split(';');
    const tokenCookie = cookies.find((row)=> row.startsWith('hexToken='));
    return tokenCookie ? tokenCookie.split('=')[1]: '';
  });
  const [products, setProducts] = useState([]);

  const handleInputChange = (e)=>{
    const {value, name} = e.target;
    setAccount({
      ...account,
      [name]: value
    })
    // console.log(account);
  }  


 


  const getProducts = async()=>{
    try {
      const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/admin/products`);
      setProducts(res.data.products);

    } catch (error) {
      console.log(error);
    }
  }


  const signIn = async()=>{
    try {
     const res = await axios.post(`${BASE_URL}/v2/admin/signin`,account)
     const{ token, expired} = res.data;
     document.cookie = `hexToken=${token}; expires=${new Date(expired)}`;
       
     axios.defaults.headers.common['Authorization'] = token;
     setIsToken(token);
     getProducts();
    } catch (error) {
     alert('登入失敗');
     console.log(error);
    }
   }


  useEffect(()=>{
    if(isToken){
      // console.log(isToken);
      axios.defaults.headers.common['Authorization'] = isToken;
      getProducts();
    }

  },[])




  const hadleLogin = (e)=>{
    e.preventDefault();
    // console.log(BASE_URL);
    // console.log(API_PATH);
    signIn();
  }

  // const hadleLogin = async (e)=>{
  //   e.preventDefault();
  //   // console.log(account);
  //   console.log(BASE_URL);
  //   console.log(API_PATH);

  //   try {
  //     const resSignin = await axios.post(`${BASE_URL}/v2/admin/signin`,account)
  //     const{ token, expired} = resSignin.data;
  //     document.cookie = `hexToken=${token}; expires=${new Date(expired)}`;
      
  //     axios.defaults.headers.common['Authorization'] = token;

  //     const getProducts = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/admin/products`);

  //     setProducts(getProducts.data.products);

  //     setIsAuth(true);
  //   } catch (error) {
  //     alert('登入失敗');
  //     console.log(error);
  //   }
  

  //   // axios.post(`${BASE_URL}/v2/admin/signin`,account)
  //   //   .then((res)=>{
  //   //     // console.log(res);
  //   //     const{ token, expired} = res.data;
  //   //     console.log(token, expired);
  //   //     document.cookie = `hexToken=${token}; expires=${new Date(expired)}`;

  //   //     axios.defaults.headers.common['Authorization'] = token;

  //   //     axios.get(`${BASE_URL}/v2/api/${API_PATH}/admin/products`)
  //   //       .then((res)=>{
  //   //         // console.log(res.data);
  //   //         setProducts(res.data.products);
  //   //       })
  //   //       .catch((error)=>{
  //   //         console.log(error);
  //   //       })

  //   //     setIsAuth(true);
  //   //   })
  //   //   .catch((error)=>{
  //   //     alert('登入失敗');
  //   //     console.log(error);
  //   //   })
  // }


  const checkUserLogin = async()=>{
    try {
      await axios.post(`${BASE_URL}/v2/api/user/check`);
      alert('使用者已登入');
    } catch (error) {
      console.log(error); 
    }

  }





  return (
    <>
     {isToken ? (<div className="container mt-5">
                    <div className="row">
                        <div className="col-6">
                            <button onClick={checkUserLogin} type='button' className='btn btn-success bt-5'>檢查使用者是否登入</button>
                            <h2>產品列表</h2>
                            <table className="table">
                                <thead>
                                    <tr>
                                    <th scope="col">產品名稱</th>
                                    <th scope="col">原價</th>
                                    <th scope="col">售價</th>
                                    <th scope="col">是否啟用</th>
                                    <th scope="col">查看細節</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((product)=>{
                                        return (
                                        <tr key={product.id}>
                                            <th scope="row">{product.title}</th>
                                            <td>{product.origin_price}</td>
                                            <td>{product.price}</td>
                                            <td>{product.is_enabled}</td>
                                            <td><button type="button" className="btn btn-primary" onClick={()=>{
                                                setTempProduct(product);
                                            }}>查看細節</button></td>
                                        </tr>)
                                    })}
                                </tbody>
                            </table>
                        </div>
                        <div className="col-6">
                            <h2>單一產品細節</h2>
                            {tempProduct.title ?(             
                                <div className="card">
                                    <img src={tempProduct.imageUrl} className="card-img-top" alt={tempProduct.title} />
                                    <div className="card-body">
                                        <h5 className="card-title">{tempProduct.title}<span className= "badge text-bg-primary">{tempProduct.category}</span></h5>
                                        <p className="card-text">商品描述：{tempProduct.description}</p>
                                        <p className="card-text">商品內容：{tempProduct.content}</p>
                                        <p className="card-text"><del>{tempProduct.origin_price}</del>/ {tempProduct.price}元</p>
                                        <h5 className="card-title">更多圖片：{tempProduct.imagesUrl?.map((image, index)=>{
                                            return <img className="img-fluid" src={image} key={index} />
                                        })}
                                        </h5>
                                    </div>
                                </div>):<p>請選擇一個商品查看</p>}
                        </div>
                    </div>
                </div>) : <div className='d-flex flex-column justify-content-center align-items-center vh-100'>
      <h1 className='mb-5'>請先登入</h1>
      <form action=""  onSubmit={hadleLogin} className='d-flex flex-column gap-3'>
        <div className='form-floating mb-3'>
          <input  name='username' value={account.username} onChange={handleInputChange} type="email" className='form-control' id='username' placeholder='name@example.com'/>
          <label htmlFor="username">Email address</label>
        </div>
        <div className='form-floating mb-3'>
          <input name='password' value={account.password} onChange={handleInputChange} type="password" className='form-control' id='password' placeholder='Password'/>
          <label htmlFor="password">Password</label>
        </div>
        <button  className='btn btn-primary'>登入</button>
      </form> 
      <p className='mt-5 mb-3 text-muted'>&copy; 2024~∞ - 六角學院</p>
     </div>}
    </>
  )
}

export default App
