import React, { useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { postData } from '../Services/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import base_url from '../../baseUrl';

const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email format').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

const LoginForm = () => {
    const initialValues = {
        email: '',
        password: '',
        rememberMe: false,
    };
    const navigate = useNavigate();
    const token = localStorage.getItem("token")
    useEffect(() => {
        if (token) {
            navigate('/')
        }
    }, []);

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            const { email, password } = values;
            const res = await axios.post(`${base_url}/admin-login`, { email, password });
            if (res.data.status) {
                toast("Login success");
                localStorage.setItem('token', res.data.token);
                navigate('/')
                resetForm();
            }
        } catch (error) {
            toast.error(error.response.data.message || "error")
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <>
            <h2 className="fs-20 fw-bolder mb-4">Login</h2>
            <h4 className="fs-13 fw-bold mb-2">Login to your account</h4>
            <p className="fs-12 fw-medium text-muted">
                Thank you for get back <strong>Wizbizla</strong> web applications, let's access our the best recommendation for you.
            </p>

            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting }) => (
                    <Form className="w-100 mt-4 pt-2">
                        <div className="mb-4">
                            <Field
                                type="email"
                                name="email"
                                className="form-control"
                                placeholder="Email or Username"
                            />
                            <ErrorMessage
                                name="email"
                                component="div"
                                className="text-danger fs-12 mt-1"
                            />
                        </div>

                        <div className="mb-3">
                            <Field
                                type='password'
                                name="password"
                                className="form-control"
                                placeholder="Password"
                            />
                            <ErrorMessage
                                name="password"
                                component="div"
                                className="text-danger fs-12 mt-1"
                            />
                        </div>

                        <div className="d-flex align-items-center justify-content-between">
                            <div className="custom-control custom-checkbox">
                                <Field
                                    type="checkbox"
                                    name="rememberMe"
                                    className="custom-control-input"
                                    id="rememberMe"
                                />
                                <label className="custom-control-label c-pointer" htmlFor="rememberMe">
                                    Remember Me
                                </label>
                            </div>
                        </div>

                        <div className="mt-5">
                            <button
                                type="submit"
                                className="btn btn-lg btn-primary w-100"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Logging in...' : 'Login'}
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </>
    );
};

export default LoginForm;
