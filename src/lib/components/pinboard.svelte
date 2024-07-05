<style>
    .pinboard {
        @apply relative h-screen w-screen min-w-96 min-h-96 cursor-default;

        background-color: #caa478;
        background-image: radial-gradient(circle at 1px 1px, #9c6f3e 1px, transparent 0);
        background-size: 30px 30px;

    }
</style>

<div class="pinboard">
	<slot />
</div>