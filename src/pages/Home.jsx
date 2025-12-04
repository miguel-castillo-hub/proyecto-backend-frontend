import { useEffect, useState } from "react"
import Layout from "../components/Layout"
import UpdateProduct from "../components/UpdateProduct"
import { useAuth } from "../context/AuthContext"
import { CATEGORIES } from "../constants/categories"

const Home = () => {
  const [products, setProducts] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [filters, setFilters] = useState({
    nombre: "",
    stock: 0,
    categoria: "",
    precioMin: 0,
    precioMax: 0,
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

      alert(`${dataResponse.data.nombre} borrado con éxito.`)
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

    if (filters.nombre) query.append("nombre", filters.nombre)
    if (filters.stock) query.append("stock", filters.stock)
    if (filters.categoria) query.append("categoria", filters.categoria)
    if (filters.precioMin) query.append("precioMin", filters.precioMin)
    if (filters.precioMax) query.append("precioMax", filters.precioMax)

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
          <label>
            Nombre
            <input type="text" name="nombre" placeholder="Buscar por nombre" onChange={handleChange} value={filters.nombre} />
          </label>
          <label>
            Stock
            <input type="number" name="stock" placeholder="Ingrese el stock" onChange={handleChange} value={filters.stock} />
          </label>
          <label>
            Categoría
            <select name="categoria" onChange={handleChange} value={filters.categoria}>
              <option selected>Todas las categorías</option>
              {
                CATEGORIES.map((categoria) => <option key={categoria.id} value={categoria.value} >{categoria.content}</option>)
              }
            </select>
          </label>
          <label>
            Precio mínimo
            <input type="number" name="precioMin" placeholder="Precio mínimo" onChange={handleChange} value={filters.precioMin} />
          </label>
          <label>
            Precio máximo
            <input type="number" name="precioMax" placeholder="Precio máximo" onChange={handleChange} value={filters.precioMax} />
          </label>
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
            <h3>{p.nombre}</h3>
            <p>{p.descripcion}</p>
            <p><strong>Precio:</strong> ${p.precio}</p>
            <p><strong>Stock:</strong> {p.stock}</p>
            <p><strong>Categoría:</strong> {p.categoria}</p>
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