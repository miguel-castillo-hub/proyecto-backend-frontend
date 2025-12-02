import { useState } from "react"

const UpdateProduct = ({ product, onClose, onUpdate }) => {
  const [loader, setLoader] = useState(false)
  const [formData, setFormData] = useState({
    name: product.name,
    description: product.description,
    price: product.price,
    stock: product.stock,
    category: product.category,
  })

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
      price: Number(formData.price),
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
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
          />
          <input
            name="description"
            type="text"
            value={formData.description}
            onChange={handleChange}
          />
          <input
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
          />
          <input
            name="stock"
            type="number"
            value={formData.stock}
            onChange={handleChange}
          />
          <input
            name="category"
            type="text"
            value={formData.category}
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