<template>
  <div class="d-flex align-items-center min-vh-100">
    <CContainer fluid>
      <CRow class="justify-content-center">
        <CCol md="6">
          <CCard class="mx-4 mb-0">
            <CCardBody class="p-4">
              <CForm>
                <h1>Register</h1>
                <p class="text-muted">ثبت نام کنید</p>
                <CInput
                  placeholder="نام و نام خانوادگی"
                  autocomplete="username"
                >
                  <template #prepend-content><CIcon name="cil-user"/></template>
                </CInput>

                  <CInput
                      placeholder="شماره همراه"
                      autocomplete="number"
                  >
                      <template #prepend-content><CIcon name="cil-mobile"/></template>
                  </CInput>

                  <CInput
                  placeholder="ایمیل"
                  autocomplete="email"
                  prepend="@"
                />
                <CInput
                  placeholder="رمز عبور"
                  type="password"
                  autocomplete="new-password"
                >
                  <template #prepend-content><CIcon name="cil-lock-locked"/></template>
                </CInput>
                <CInput
                  placeholder="تکرار رمز عبور"
                  type="password"
                  autocomplete="new-password"
                  class="mb-4"
                >
                  <template #prepend-content><CIcon name="cil-lock-locked"/></template>
                </CInput>
                <CButton color="success" block>ثبت نام</CButton>
              </CForm>
            </CCardBody>
            <CCardFooter class="p-4">

            </CCardFooter>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script>
export default {
  name: 'Register'
}
</script>
