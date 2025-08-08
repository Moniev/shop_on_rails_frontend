import Button from "../../atoms/button/Button";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { FaEnvelope, FaLock, FaGoogle, FaGithub, FaTwitter } from "react-icons/fa";
import * as Yup from "yup";
import "./SignInForm.scss";

const SignInForm = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("Password is required"),
      rememberMe: Yup.boolean(),
    }),
    onSubmit: (values, { setSubmitting }) => {
      console.log("Form data:", values);
      setTimeout(() => {
        alert("Login submitted! Check console for form data.");
        setSubmitting(false);
      }, 500);
    },
  });

  const handleSocialLogin = (provider) => {
    alert(`Login with ${provider} initiated. Check console.`);
  };

  return (
    <div className="sign-in-form__container relative">
      <h2 className="sign-in-form__title">Sign In</h2>
      <form onSubmit={formik.handleSubmit} className="sign-in-form__form flex justify-center">
        <div className="sign-in-form__group relative items-center justify-center">
          <label htmlFor="email" className="sign-in-form__label">
            Email
          </label>
          <FaEnvelope
            className={`absolute left-3 mt-5 transform -translate-y-1/2 text-base ${
              formik.touched.email && formik.errors.email
                ? "text-red-500"
                : formik.touched.email && !formik.errors.email
                ? "text-green-500"
                : "text-cyan-600"
            }`}
          />
          <input
            type="email"
            name="email"
            id="email"
            className={`sign-in-form__input pl-10 ${
              formik.touched.email && formik.errors.email
                ? "input-error"
                : formik.touched.email && !formik.errors.email
                ? "input-success"
                : ""
            }`}
            placeholder={
              formik.touched.email && formik.errors.email
                ? formik.errors.email
                : "Enter your email"
            }
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </div>
        <div className="sign-in-form__group relative">
          <label htmlFor="password" className="sign-in-form__label">
            Password
          </label>
          <FaLock
            className={`absolute left-3 top-1/2 mt-3 transform -translate-y-1/2 text-base inline-block align-middle ${
              formik.touched.password && formik.errors.password
                ? "text-red-500"
                : formik.touched.password && !formik.errors.password
                ? "text-green-500"
                : "text-cyan-600"
            }`}
          />
          <input
            type="password"
            name="password"
            id="password"
            className={`sign-in-form__input pl-10 ${
              formik.touched.password && formik.errors.password
                ? "input-error"
                : formik.touched.password && !formik.errors.password
                ? "input-success"
                : ""
            }`}
            placeholder={
              formik.touched.password && formik.errors.password
                ? formik.errors.password
                : "Enter your password"
            }
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </div>
        <div className="sign-in-form__group flex items-center">
          <input
            type="checkbox"
            name="rememberMe"
            id="rememberMe"
            className="mr-2"
            checked={formik.values.rememberMe}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <label htmlFor="rememberMe" className="sign-in-form__label">
            Remember Me
          </label>
        </div>

        <Button type="submit" variant="submit" disabled={formik.isSubmitting}>
          Submit
        </Button>
      </form>

      <div className="sign-in-form__reset-password mt-2 text-center">
        <a
          href="/reset-password"
          className="text-cyan-600 text-shadow-sky-100 font-bold hover:underline hover:text-cyan-400"
        >
          Forgot Password?
        </a>
      </div>

      <div className="flex flex-row justify-center gap-4 mt-4">
        <Button
          variant="circle google"
          onClick={() => handleSocialLogin("Google")}
          aria-label="Sign in with Google"
        >
          <FaGoogle className="text-xl" />
        </Button>
        <Button
          variant="circle github"
          onClick={() => handleSocialLogin("GitHub")}
          aria-label="Sign in with GitHub"
        >
          <FaGithub className="text-xl" />
        </Button>
        <Button
          variant="circle twitter"
          onClick={() => handleSocialLogin("Twitter")}
          aria-label="Sign in with Twitter"
        >
          <FaTwitter className="text-xl" />
        </Button>
      </div>

      <div className="sign-in-form__reset-password mt-2 text-center">
        <Button onClick={() => navigate("/sign-up")}>
          <a className="text-cyan-600 text-shadow-sky-100 font-bold hover:underline hover:text-cyan-400">
            Don't have an account? Sign up
          </a>
        </Button>
      </div>
    </div>
  );
};

export default SignInForm;