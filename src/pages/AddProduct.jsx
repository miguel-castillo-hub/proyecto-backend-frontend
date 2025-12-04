import { useState } from "react"
import Layout from "../components/Layout"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"

const AddProduct = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    categoria: ""
  })

  const navigate = useNavigate()

  const { token } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()

    const dataToSend = {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
    }

    try {
      const response = await fetch(`https://backend-utn.onrender.com/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(dataToSend)
      })

      if (!response.ok) {
        alert("Error :(")
        return
      }

      alert("Producto envíado :)")
      setFormData({
        nombre: "",
        descripcion: "",
        precio: "",
        stock: "",
        categoria: ""
      })
    } catch (error) {

    }
  }

  const handleChange = (e) => {
    const nombreDeInput = e.target.name
    setFormData({ ...formData, [nombreDeInput]: e.target.value })
  }

  return (
    <Layout>
      <div className="page-banner">Agregar Nuevo Producto</div>

      <section className="page-section">
        <form className="form-container" onSubmit={(e) => handleSubmit(e)}>
          <input
            type="text"
            placeholder="Nombre"
            name="nombre"
            minLength={3}
            maxLength={20}
            onChange={(e) => handleChange(e)}
            value={formData.name}
          />
          <input
            type="text"
            placeholder="Descripción"
            name="descripcion"
            onChange={(e) => handleChange(e)}
            value={formData.description}
          />
          <input
            type="number"
            placeholder="Precio"
            name="precio"
            min={0}
            onChange={(e) => handleChange(e)}
            value={formData.price}
          />
          <input
            type="number"
            placeholder="Stock"
            name="stock"
            min={0}
            onChange={(e) => handleChange(e)}
            value={formData.stock}
          />
          <input
            type="text"
            placeholder="Categoría"
            name="categoria"
            minLength={3}
            maxLength={20}
            onChange={(e) => handleChange(e)}
            value={formData.category} />
          <button
            type="submit">Agregar
          </button>
        </form>
      </section>
    </Layout>
  )
}

export default AddProduct