<template>
    <h1>Welcome, {{ name }}</h1>
</template>

<script>
    export default {
        name: 'AdminMenu',
        props: ['name'],
    }
</script>