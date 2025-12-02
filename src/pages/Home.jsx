import { useEffect, useState } from "react"
import Layout from "../components/Layout"
import UpdateProduct from "../components/UpdateProduct"
import { useAuth } from "../context/AuthContext"
import { CATEGORIES } from "../constants/categories"

const Home = () => {
  const [products, setProducts] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [filters, setFilters] = useState({
    name: "",
    stock: 0,
    category: "",
    minPrice: 0,
    maxPrice: 0,
  })
  const [respondServer, setRespondServer] = useState({
    success: null,
    notification: null,
    error: {
      fetch: null,
      delete: null
    }
  })

  const { user, token } = useAuth()

  const fetchingProducts = async (query = "") => {
    setRespondServer({
      success: null,
      notification: null,
      error: {
        fetch: null,
        delete: null
      }
    })
    try {
      const response = await fetch(`http://localhost:3861/v3/productos?${query}`, {
        method: "GET"
      })
      const dataProducts = await response.json()
      setProducts(dataProducts.data.reverse())
    } catch (e) {
      setRespondServer({
        success: false,
        notification: e.message,
        error: {
          ...respondServer.error,
          fetch: false
        }
      })
    }
  }

  useEffect(() => {
    fetchingProducts()
  }, [])

  const deleteProduct = async (idProduct) => {
    setRespondServer({
      ...error,
      delete: null
    })
    if (!confirm("¿Estás seguro de que quieres borrar el producto?")) {
      return
    }

    try {
      const response = await fetch(`http://localhost:3861/v3/productos/${idProduct}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
      const dataResponse = await response.json()

      if (dataResponse.error) {
        alert(dataResponse.error)
        return
      }

      setProducts(products.filter((p) => p._id !== idProduct))

      alert(`${dataResponse.data.name} borrado con éxito.`)
    } catch (error) {
      setRespondServer({ ...error, delete: "No se pudo borrar :(" })
    }
  }

  const handleUpdateProduct = (p) => {
    setSelectedProduct(p)
  }

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const query = new URLSearchParams()

    if (filters.name) query.append("name", filters.name)
    if (filters.stock) query.append("stock", filters.stock)
    if (filters.category) query.append("category", filters.category)
    if (filters.minPrice) query.append("minPrice", filters.minPrice)
    if (filters.maxPrice) query.append("maxPrice", filters.maxPrice)

    fetchingProducts(query.toString)
  }

  const handleResetFilter = () => {

  }

  return (
    <Layout>
      <div className="page-banner">Nuestros Productos</div>

      <section className="page-section">
        <p>
          Bienvenido {user && user.id} a nuestra tienda. Aquí encontrarás una amplia variedad de productos diseñados para satisfacer
          tus necesidades. Nuestro compromiso es ofrecer calidad y confianza.
        </p>
      </section>

      <section>
        <form className="filters-form" onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Buscar por nombre" onChange={handleChange} value={filters.name} />
          <input type="number" name="stock" placeholder="Ingrese el stock" onChange={handleChange} value={filters.stock} />
          <select name="category" onChange={handleChange} value={filters.category}>
            <option selected>Todas las categorías</option>
            {
              CATEGORIES.map((category) => <option key={category.id} value={category.value} >{category.content}</option>)
            }
          </select>
          <input type="number" name="minPrice" placeholder="Precio mínimo" onChange={handleChange} value={filters.minPrice} />
          <input type="number" name="maxPrice" placeholder="Precio máximo" onChange={handleChange} value={filters.maxPrice} />
          <button type="submit">Aplicar Filtros</button>
          <button type="button" onClick={handleResetFilter}>Cancelar</button>
        </form>
      </section>

      {
        selectedProduct && <UpdateProduct
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onUpdate={fetchingProducts}
        />
      }

      <section className="products-grid">
        {products.map((p, i) => (
          <div key={i} className="product-card">
            <h3>{p.name}</h3>
            <p>{p.description}</p>
            <p><strong>Precio:</strong> ${p.price}</p>
            <p><strong>Stock:</strong> {p.stock}</p>
            <p><strong>Categoría:</strong> {p.category}</p>
            {
              user && <div className="cont-btn">
                <button onClick={() => handleUpdateProduct(p)}>Actualizar</button>
                {user && <button onClick={() => deleteProduct(p._id)}>Borrar</button>}
              </div>
            }
          </div>
        ))}
      </section>
      {!respondServer.error.fetch && <p>{respondServer.notification}</p>}
    </Layout>
  )
}

export default Home