<template>
  <div>
    <PageHeader title="Options" subtitle="Customize kahoot-tools"/>
    <OptionsForm></OptionsForm>
  </div>
</template>

<script>
import PageHeader from "@/components/PageHeader";
import OptionsForm from "@/components/OptionsForm";

export default {
  components: {
    PageHeader,
    OptionsForm
  }
};
</script>
