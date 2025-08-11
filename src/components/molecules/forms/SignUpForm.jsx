import Button from "../../atoms/button/Button";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { FaTimes, FaEnvelope, FaLock, FaUser, FaGoogle, FaGithub, FaTwitter } from "react-icons/fa";
import { useModalStore } from "../../../store/ModalStore";
import * as Yup from "yup";
import "./SignInForm.scss"; 

const SignUpForm = () => {
  const navigate = useNavigate();
  const { closeModal, openModal } = useModalStore();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("Password is required"),
    }),
    onSubmit: (values, { setSubmitting }) => {
      setSubmitting(false);
      closeModal(); 
    },
  });

  const handleSocialLogin = (provider) => {
  };

  const handleSwitchToSignIn = () => {
    openModal('signIn');
  };

  const handleFocus = (e) => {
    const { name } = e.target;
    formik.setFieldError(name, '');
    formik.setFieldTouched(name, false, false);
  };

  const getIconClassName = (field) => {
    if (formik.touched[field] && formik.errors[field]) {
      return "is-error";
    }
    if (formik.touched[field] && !formik.errors[field]) {
      return "is-success";
    }
    return "";
  };

  return (
    <div className="sign-in-form__container">
        <Button
        onClick={closeModal}
        variant="submit md circle modal-close-button" 
      >
        <FaTimes />
      </Button>
      <h2 className="sign-in-form__title">Sign Up</h2>
      <form onSubmit={formik.handleSubmit} className="sign-in-form__form">
        <div className="sign-in-form__group">
          <label htmlFor="name" className="sign-in-form__label">
            Name
          </label>
          <div className="sign-in-form__input-wrapper">
            <FaUser className={`sign-in-form__input-icon ${getIconClassName('name')}`} />
            <input
              type="text"
              name="name"
              id="name"
              className={`sign-in-form__input ${getIconClassName('name')}`}
              placeholder={formik.touched.name && formik.errors.name ? formik.errors.name : "Enter your name"}
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              onFocus={handleFocus} 
            />
          </div>
        </div>

        <div className="sign-in-form__group">
          <label htmlFor="email" className="sign-in-form__label">
            Email
          </label>
          <div className="sign-in-form__input-wrapper">
            <FaEnvelope className={`sign-in-form__input-icon ${getIconClassName('email')}`} />
            <input
              type="email"
              name="email"
              id="email"
              className={`sign-in-form__input ${getIconClassName('email')}`}
              placeholder={formik.touched.email && formik.errors.email ? formik.errors.email : "Enter your email"}
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              onFocus={handleFocus}
            />
          </div>
        </div>

        <div className="sign-in-form__group">
          <label htmlFor="password" className="sign-in-form__label">
            Password
          </label>
          <div className="sign-in-form__input-wrapper">
            <FaLock className={`sign-in-form__input-icon ${getIconClassName('password')}`} />
            <input
              type="password"
              name="password"
              id="password"
              className={`sign-in-form__input ${getIconClassName('password')}`}
              placeholder={formik.touched.password && formik.errors.password ? formik.errors.password : "Enter your password"}
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              onFocus={handleFocus} 
            />
          </div>
        </div>

        <Button type="submit" variant="submit" disabled={formik.isSubmitting}>
          Create Account
        </Button>
      </form>

      <div className="sign-in-form__separator">
        <span>or sign up with</span>
      </div>

      <div className="sign-in-form__social-login">
        <Button variant="circle google" onClick={() => handleSocialLogin("Google")} aria-label="Sign up with Google">
          <FaGoogle />
        </Button>
        <Button variant="circle github" onClick={() => handleSocialLogin("GitHub")} aria-label="Sign up with GitHub">
          <FaGithub />
        </Button>
        <Button variant="circle twitter" onClick={() => handleSocialLogin("Twitter")} aria-label="Sign up with Twitter">
          <FaTwitter />
        </Button>
      </div>

      <div className="sign-in-form__footer">
        <p>Already have an account? 
          <a onClick={handleSwitchToSignIn} className="sign-in-form__link">
             Sign in
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignUpForm;
