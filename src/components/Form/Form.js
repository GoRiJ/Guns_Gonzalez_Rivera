import React, { useState, useContext } from 'react';
import { db } from '../../services/index';
import { collection, doc, addDoc, getDoc, updateDoc } from 'firebase/firestore';
import { GlobalContext } from '../../context/GlobalContext';
import './Form.css';

export const Form = ({ purchase, purchaseUnit, purchaseTotal, clear, handleSignIn, handleSignUp }) => {

    const [form, setForm] = useState({

        buyer: {

            email: "",
            name: "",
            telephone: "", 

        },
        total: purchaseTotal,
        items: purchaseUnit,
        purchase: purchase,

    }),
    { buyer: { email, name, telephone }, } = form, 
    {setLoading, setBuyAlert} = useContext(GlobalContext);

    const infoStock = async ({ id, quantity }) => {

        setLoading(true);
        const info = doc(db, "products", id);
        try {
            const res = await getDoc(info);
            let result = res.data();
            console.log(result);
            await updateDoc(info, {stock: result.stock - quantity});
            setLoading(false);
        } catch (err) {
            console.log(err);
        };

    };

    const checkoutInfo = async ({ data }) => {

        try {
            const col = collection(db, "orders");
            await addDoc(col, data);
            setBuyAlert(true);
        } catch (err) {
            console.log(err);
        };

    };

    const checkoutStock = ({ data }) => {

        purchase.forEach(element => {
            infoStock({ id: element.id, quantity: element.quantity });
        });
        checkoutInfo({ data });

    };

    const handleSubmit = (e) => {

        e.preventDefault();

        const requiredData = (fields) => {

            return fields.some(field => field === "");

        };

        if (requiredData([email, name, telephone])) {

            alert("No se rellenaron campos del Formulario. :(");
            return;

        };

        checkoutStock({ data: form });
        clear();

    };

    const handleChange = (e) => {

        const {name, value} = e.target

        setForm({
            ...form,
            buyer: {
                ...form.buyer,
                [name]: value,
            },
        });

    };

    return (

        <article id="inicio" className="article__form form">

            <div className="form__color">

                <div className="color__box signin">

                    <h3> ¿Ya Tienes Una Cuenta? </h3>
                    <button onClick={() => {handleSignIn()}} className="signin--btn"> Ingresa </button>

                </div>

                <div className="color__box signup">

                    <h3>{ purchase.length > 0 ? "¡¡Genera el Ticket de tu Compra!!" : "¿No Tienes Una Cuenta?"}</h3>
                    <button onClick={() => {handleSignUp()}} className="signup--btn">{ purchase.length > 0 ? "Generar" : "Registrate" }</button>

                </div>

            </div>

            <div className="form__form">

                <div className="form__form--signin form__box">

                    <form>

                        <h4> Ingresa </h4>
                        <input type="email" placeholder="Ingresa tu E-Mail :" required/>
                        <input type="password" name="password" autoComplete="on" placeholder="Ingresa tu Contraseña :" required/>
                        <input type="submit" value="Ingresar"/>
                        <a href="#inicio" className="forgot"> Olvidé mi Contraseña </a>

                    </form>

                </div>

                { purchase.length === 0 && (
                
                    <div className="form__form--signup form__box">

                        <form>

                            <h4> Registrate </h4>
                            <input type="text" placeholder="Ingresa tu Nombre :" required/>
                            <input type="email" placeholder="Ingresa tu E-Mail :" required/>
                            <input type="tel" placeholder="Ingresa tu Número :" required/>
                            <input type="password" name="password" autoComplete="on" placeholder="Ingresa tu Contraseña :" required/>
                            <input type="password" name="password-confirm" autoComplete="on" placeholder="Confirma tu Contraseña :" required/>
                            <input type="button" value="Registrarse"/>

                        </form>

                    </div>
                
                )}

                { purchase.length > 0 && (
                
                    <div className="form__form--signup form__box">

                        <form onSubmit={handleSubmit}>

                            <h4> Generar Ticket </h4>
                            <input type="text" name="name" value={name} onChange={handleChange} placeholder="Ingresa tu Nombre :" required/>
                            <input type="email" name="email" value={email} onChange={handleChange} placeholder="Ingresa tu E-Mail :" required/>
                            <input type="tel" name="telephone" value={telephone} onChange={handleChange} placeholder="Ingresa tu Número :" required/>
                            <input type="submit" value="Registrarse"/>

                        </form>

                    </div>
                
                )}

            </div>

        </article>

    );

};