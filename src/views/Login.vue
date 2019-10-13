<template>
  <div>
    <PageHeader title="Kahoot Tools" subtitle="Created by @idiidk"/>
    <LoginForm/>
  </div>
</template>

<script>
import PageHeader from "@/components/PageHeader";
import LoginForm from "@/components/Forms/LoginForm";

export default {
  components: {
    PageHeader,
    LoginForm
  }
};
</script>
