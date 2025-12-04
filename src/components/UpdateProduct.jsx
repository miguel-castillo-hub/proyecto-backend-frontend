import { useState } from "react"
import { useAuth } from "../context/AuthContext"

const UpdateProduct = ({ product, onClose, onUpdate }) => {
  const [loader, setLoader] = useState(false)
  const [formData, setFormData] = useState({
    nombre: product.nombre,
    descripcion: product.descripcion,
    precio: product.precio,
    stock: product.stock,
    categoria: product.categoria,
  })
  const { token } = useAuth()

  const handleChange = (e) => {
    console.log(e.target)
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const dataToUpdate = {
      ...formData,
      precio: Number(formData.precio),
      stock: Number(formData.stock)
    }

    try {
      setLoader(true)
      const response = await fetch(`http://localhost:3861/v3/productos/${product._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(dataToUpdate)
      })

      onUpdate()
      onClose()
    } catch (error) {
      console.log(error)
      console.log("Error al actualizar el objeto :(")
    } finally {
      setLoader(false)
    }
  }

  return (
    <section className="modal-overlay">
      <div className="modal-box">
        <h2>Editar producto</h2>
        <form className="form-container" onSubmit={handleSubmit}>
          <input
            name="nombre"
            type="text"
            value={formData.nombre}
            onChange={handleChange}
          />
          <input
            name="descripcion"
            type="text"
            value={formData.descripcion}
            onChange={handleChange}
          />
          <input
            name="precio"
            type="number"
            value={formData.precio}
            onChange={handleChange}
          />
          <input
            name="stock"
            type="number"
            value={formData.stock}
            onChange={handleChange}
          />
          <input
            name="categoria"
            type="text"
            value={formData.categoria}
            onChange={handleChange}
          />
          <button type="submit">{loader ? "Enviando..." : "Enviar"}</button>
          <button className="close-btn" type="button" onClick={onClose}>Cancelar</button>
        </form>
      </div>
    </section>
  )
}

export default UpdateProduct