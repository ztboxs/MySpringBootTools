<center><h2>SpringBoot整合腾讯云COS对象存储实现文件上传</h2></center>

#### 1.yml配置密钥,COS信息

```yml
cos:
  baseUrl: fxxxxxa-1xxxxx1.cos.ap-shanghai.myqcloud.com
  accessKey: xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  secretKey: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  #看自己的地址在哪改 ap-城市拼音
  regionName: ap-guangzhou
  #储存罐名称---格式-“名字-id”
  bucketName: fxxxxxa-1xxxxx1
  #储存罐目录-没有自动创建/files目录
  folderPrefix: /files
```



#### 2.COSConfig配置类

```java
@Data
@Component
@ConfigurationProperties(prefix = "cos")
public class COSConfig {
    private String baseUrl;
    private String accessKey;
    private String secretKey;
    private String regionName;
    private String bucketName;
    private String folderPrefix;
}
```

#### 3.COS文件上传工具类

```java
package com.ztboxs.lieboxs.utils.CloudTencent;

import com.qcloud.cos.COSClient;
import com.qcloud.cos.ClientConfig;
import com.qcloud.cos.auth.BasicCOSCredentials;
import com.qcloud.cos.auth.COSCredentials;
import com.qcloud.cos.model.PutObjectRequest;
import com.qcloud.cos.model.UploadResult;
import com.qcloud.cos.region.Region;
import com.qcloud.cos.transfer.TransferManager;
import com.qcloud.cos.transfer.Upload;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.time.DateFormatUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.Date;
import java.util.UUID;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * 天天进步
 *
 * @Author: ztbox
 * @Date: 2022/10/24/21:46
 * @Description:
 */
@Slf4j
public class COSClientUtil {

    /**
     * 获取配置信息
     */
    private static COSConfig cosConfig = SpringBeanUtils.getBean(COSConfig.class);

    /**
     * 初始化用户身份信息
     */
    private static COSCredentials cred = new BasicCOSCredentials(cosConfig.getAccessKey(), cosConfig.getSecretKey());

    /**
     * 设置bucket的区域
     */
    private static ClientConfig clientConfig = new ClientConfig(new Region(cosConfig.getRegionName()));

    /**
     * 生成COS客户端
     */
    private static COSClient cosClient = new COSClient(cred, clientConfig);

    /**
     * 上传文件
     *
     * @param file
     * @return
     * @throws Exception
     */
    public static String upload(MultipartFile file) throws Exception {
        String date = DateFormatUtils.format(new Date(),"yyyy-MM-dd HH:mm:ss");
        String originalFilename = file.getOriginalFilename();
        UUID uuid = UUID.randomUUID();
        String sUUID = uuid.toString();
//        long nextId = IdGenerator.getFlowIdWorkerInstance().nextId();
        String name = sUUID.replace("-", "") + originalFilename.substring(originalFilename.lastIndexOf("."));
        String folderName = cosConfig.getFolderPrefix() + "/" + date + "/";
        String key = folderName + name;
        File localFile = null;
        try {
            localFile = transferToFile(file);
            String filePath = uploadFileToCOS(localFile, key);
            log.info("upload COS successful: {}", filePath);
            return filePath;
        } catch (Exception e) {
            throw new Exception("文件上传失败");
        } finally {
            localFile.delete();
        }
    }

    /**
     * 上传文件到COS
     *
     * @param localFile
     * @param key
     * @return
     */
    private static String uploadFileToCOS(File localFile, String key) throws InterruptedException {
        PutObjectRequest putObjectRequest = new PutObjectRequest(cosConfig.getBucketName(), key, localFile);
        ExecutorService threadPool = Executors.newFixedThreadPool(8);
        // 传入一个threadPool, 若不传入线程池, 默认TransferManager中会生成一个单线程的线程池
        TransferManager transferManager = new TransferManager(cosClient, threadPool);
        // 返回一个异步结果Upload, 可同步的调用waitForUploadResult等待upload结束, 成功返回UploadResult, 失败抛出异常
        Upload upload = transferManager.upload(putObjectRequest);
        UploadResult uploadResult = upload.waitForUploadResult();
        transferManager.shutdownNow();
        cosClient.shutdown();
        String filePath = cosConfig.getBaseUrl() + uploadResult.getKey();
        return filePath;
    }

    /**
     * 用缓冲区来实现这个转换, 即创建临时文件
     * 使用 MultipartFile.transferTo()
     *
     * @param multipartFile
     * @return
     */
    private static File transferToFile(MultipartFile multipartFile) throws IOException {
        String originalFilename = multipartFile.getOriginalFilename();
        String prefix = originalFilename.split("\\.")[0];
        String suffix = originalFilename.substring(originalFilename.lastIndexOf("."));
        File file = File.createTempFile(prefix, suffix);
        multipartFile.transferTo(file);
        return file;
    }

}
```

#### 3.1定义一个SpringBeanUtils工具类

```java
package com.ztboxs.lieboxs.utils.CloudTencent;

import org.springframework.beans.BeansException;
import org.springframework.beans.factory.NoSuchBeanDefinitionException;
import org.springframework.beans.factory.config.BeanFactoryPostProcessor;
import org.springframework.beans.factory.config.ConfigurableListableBeanFactory;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

/**
 * 天天进步
 *
 * @Author: ztbox
 * @Date: 2022/10/24/22:48
 * @Description:
 */
@Lazy(false)
@Component
public final class SpringBeanUtils implements BeanFactoryPostProcessor {

    /**
     * The bean factory.
     */
    private static ConfigurableListableBeanFactory beanFactory; // Spring应用上下文环境

    /**
     * 获取对象.
     *
     * @param <T>  the generic type
     * @param name the name
     * @return Object 一个以所给名字注册的bean的实例
     * @throws BeansException the beans exception
     */
    @SuppressWarnings("unchecked")
    public static <T> T getBean(String name) throws BeansException {
        return (T) beanFactory.getBean(name);
    }

    /**
     * 获取类型为requiredType的对象.
     *
     * @param <T> the generic type
     * @param clz the clz
     * @return the bean
     * @throws BeansException the beans exception
     */
    public static <T> T getBean(Class<T> clz) throws BeansException {
        T result = beanFactory.getBean(clz);
        return result;
    }

    /**
     * spring获取不到则构造一个
     *
     * @param clz
     * @param <T>
     * @return
     */
    public static <T> T getBeanOrNewInstance(Class<T> clz) {
        T result = null;
        try {
            result = getBean(clz);
        } catch (NoSuchBeanDefinitionException e) {
            try {
                result = clz.newInstance();
            } catch (Exception e1) {
                throw new RuntimeException(e1.getMessage(), e1);
            }
        }
        return result;
    }

    public static <T> T getBeanOrNewInstance(String realClass, Class<T> clz){
        try {
            Class<T> clazz = (Class<T>)Class.forName(realClass);
            return getBeanOrNewInstance(clazz);
        } catch (ClassNotFoundException e) {
            throw new RuntimeException(e.getMessage(), e);
        }
    }

    /**
     * 如果BeanFactory包含一个与所给名称匹配的bean定义，则返回true.
     *
     * @param name the name
     * @return boolean
     */
    public static boolean containsBean(String name) {
        return beanFactory.containsBean(name);
    }

    /**
     * 判断以给定名字注册的bean定义是一个singleton还是一个prototype。
     * 如果与给定名字相应的bean定义没有被找到，将会抛出一个异常（NoSuchBeanDefinitionException）.
     *
     * @param name the name
     * @return boolean
     * @throws NoSuchBeanDefinitionException the no such bean definition exception
     */
    public static boolean isSingleton(String name) throws NoSuchBeanDefinitionException {
        return beanFactory.isSingleton(name);
    }

    /**
     * Gets the type.
     *
     * @param name the name
     * @return Class 注册对象的类型
     * @throws NoSuchBeanDefinitionException the no such bean definition exception
     */
    public static Class<?> getType(String name) throws NoSuchBeanDefinitionException {
        return beanFactory.getType(name);
    }

    /**
     * 如果给定的bean名字在bean定义中有别名，则返回这些别名.
     *
     * @param name the name
     * @return the aliases
     * @throws NoSuchBeanDefinitionException the no such bean definition exception
     */
    public static String[] getAliases(String name) throws NoSuchBeanDefinitionException {
        return beanFactory.getAliases(name);
    }

    /**
     * Gets the bean factory.
     *
     * @return the bean factory
     */
    public static ConfigurableListableBeanFactory getBeanFactory() {
        return beanFactory;
    }

    @Override
    @SuppressWarnings("hiding")
    public void postProcessBeanFactory(ConfigurableListableBeanFactory beanFactory) throws BeansException {
        SpringBeanUtils.beanFactory = beanFactory;
    }

    private static Boolean readyFlag = false;

    public static Boolean getReadyFlag() {
        return readyFlag;
    }

    public static void setReadyFlag(Boolean readyFlag) {
        SpringBeanUtils.readyFlag = readyFlag;
    }
}

```



#### 4.Controller测试上传接口

```java
    /**
     * 腾讯云COS上传
     *
     * @param file
     * @return
     * @throws Exception
     */
    @PostMapping(value = "/cUpload")
    public ResponseEntity Upload(MultipartFile file) throws Exception {
        String filePath = COSClientUtil.upload(file);
        return ResultVOUtil.success(filePath);
    }
```

