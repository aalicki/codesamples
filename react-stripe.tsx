import React, { useState, useEffect } from "react";
import {
    CardElement,
    useStripe,
    useElements
} from "@stripe/react-stripe-js";
import {Alert, Spinner} from "react-bootstrap";
import "./_checkout.scss"

export default function CheckoutForm() {

    const [succeeded, setSucceeded]         = useState(false);
    const [error, setError]                 = useState(null);
    const [processing, setProcessing]       = useState(false);
    const [disabled, setDisabled]           = useState(true);
    const [clientSecret, setClientSecret]   = useState('');
    const stripe                            = useStripe();
    const elements                          = useElements();
    const nodeServer                        = process.env.GATSBY_HANDLE_PAYMENT_INTENT_URL;

    useEffect(() => {

        // Create PaymentIntent as soon as the page loads
        window
            .fetch(nodeServer + "/create-payment-intent", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(
                    {
                        items: [
                            {
                                id: 5,
                                name: "Example Product"
                            },
                            {
                                id: 6,
                                name: "Another Test Product"
                            }
                        ]
                    }
                )
            })
            .then(res => {
                return res.json();
            })
            .then(data => {
                setClientSecret(data.clientSecret);
            });
    }, []);

    const cardStyle = {
        style: {
            base: {
                color: "#32325d",
                fontFamily: 'Arial, sans-serif',
                fontSmoothing: "antialiased",
                fontSize: "16px",
                "::placeholder": {
                    color: "#32325d"
                }
            },
            invalid: {
                color: "#fa755a",
                iconColor: "#fa755a"
            }
        }
    };

    const handleChange = async (event) => {
        // Listen for changes in the CardElement
        // and display any errors as the customer types their card details
        setDisabled(event.empty);
        setError(event.error ? event.error.message : "");
    };

    const handleSubmit = async ev => {
        // Ensure we don't submit the form
        ev.preventDefault();

        setProcessing(true);

        const payload = await stripe.confirmCardPayment(clientSecret, {

            payment_method: {
                card: elements.getElement(CardElement),
                billing_details: {
                    name: ev.target.name.value
                }
            }
        });

        if (payload.error) {

            setError(`Payment failed: ${payload.error.message}`);
            setProcessing(false);
        } else {

            // All is well, let's move forward and update the UI
            setError(null);
            setProcessing(false);
            setSucceeded(true);
        }
    };

    return (

        <form id="payment-form" onSubmit={handleSubmit}>

            <CardElement id="card-element" options={cardStyle} onChange={handleChange} />
            <button
                disabled={processing || disabled || succeeded}
                id="submit"
            >
        <span id="button-text">
          {processing ? (
              <Spinner animation="border" role="status">
                  <span className="sr-only">Loading...</span>
              </Spinner>
          ) : (
              "Pay Now"
          )}
        </span>
            </button>

            {/* Show any error that happens when processing the payment */}
            {error && (
                <div className="result-message card-error" role="alert">
                    <Alert variant="warning">
                        {error}
                    </Alert>
                </div>
            )}

            {/* Show a success message upon completion */}
            <div className={succeeded ? "result-message" : "result-message hidden"} role="alert">
                <Alert variant="success">
                    Payment processed successfully!
                </Alert>

            </div>
        </form>
    );
}
