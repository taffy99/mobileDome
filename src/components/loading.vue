<template>
    <section class="loadContent">
        <div class='mock'>
            <div class='main'>
                <mt-spinner type="triple-bounce"></mt-spinner>
            </div>
        </div>
    </section>
</template> 
<script>
import { Spinner } from 'mint-ui';
export default {
    
}
</script>
   
<style>
    .loadContent{
        width:100vh;
        height:100vh;
        position:relative;
    }
    .mock{
        width:100vh;
        height:100vh;
        position:absolute;
        z-index:100;
        background-color:rgba(171, 178, 191, 0.5);
    }
    .main{
       margin: 40% 25%; 
    }
</style>
