// Utility functions for working with cookies
const setCookie = (name, value, days) => {
  const expires = new Date()
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
  document.cookie =
    name +
    '=' +
    encodeURIComponent(value) +
    ';expires=' +
    expires.toUTCString() +
    ';path=/'
}

const getCookie = (name) => {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
  if (match) {
    return decodeURIComponent(match[2])
  }
  return null
}

// Load the saved checkbox state from the cookie
if (getCookie('rememberMe') === 'true') {
  const rememberMe = document.querySelector('#remember-me')
  rememberMe.checked = true
  loginForm.email.value = getCookie('email')
  loginForm.password.value = getCookie('password')
}

// NOTE: Authentication.
const loginForm = document.getElementById('login-form')

const handleSubmitLogin = (event) => {
  event.preventDefault()
  const email = document.querySelector('#email').value
  const password = document.querySelector('#password').value
  const rememberMe = document.querySelector('#remember-me')
  axios
    .post('http://127.0.0.1:3000/login', { email, password })
    .then(({ data }) => {
      const token = data.token
      // Set the token as a header
      axios.defaults.headers.common['Authorization'] = token
      localStorage.setItem('AUTH_TOKEN', token)
      // Save the checkbox state to the cookie when it changes
      if (rememberMe.checked) {
        setCookie('rememberMe', true, 365)
        setCookie('email', email, 365)
        setCookie('password', password, 365)
      } else {
        setCookie('rememberMe', false, 365)
        setCookie('email', '', 365)
        setCookie('password', '', 365)
      }

      verifyToken()
    })
    .catch((error) => {
      console.error(error)
      const { response } = error
      if (response) {
        const { data } = response
        alert(data.message)
      } else {
        alert('An error occurred while submitting the form.')
      }
    })
}

const verifyToken = () => {
  axios
    .get('http://127.0.0.1:3000/protected')
    .then(({ data }) => {
      localStorage.setItem('USER_DATA', JSON.stringify(data.user))
      window.location.href = 'profile.html'
    })
    .catch((error) => {
      console.error(error)
      const { response } = error
      if (response) {
        const { data } = response
        alert(data.message)
      } else {
        alert('An error occurred while submitting the form.')
      }
    })
}

loginForm.addEventListener('submit', handleSubmitLogin)
