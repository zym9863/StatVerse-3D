#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
PWA 图标生成器
使用 icon.png 生成不同尺寸的 PWA 应用图标
"""

from PIL import Image
import os


def generate_icons(input_path: str, output_dir: str):
    """
    从源图标生成不同尺寸的 PWA 图标
    
    参数:
        input_path: 源图标路径 (icon.png)
        output_dir: 输出目录路径
    """
    # PWA 需要的图标尺寸
    sizes = [72, 96, 128, 144, 152, 192, 384, 512]
    
    # 确保输出目录存在
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        print(f"创建输出目录: {output_dir}")
    
    try:
        # 打开源图标
        with Image.open(input_path) as img:
            print(f"源图标尺寸: {img.size}")
            print(f"源图标模式: {img.mode}")
            
            # 转换为 RGBA 模式以支持透明度
            if img.mode != 'RGBA':
                img = img.convert('RGBA')
            
            # 为每个尺寸生成图标
            for size in sizes:
                # 使用高质量的 Lanczos 重采样算法
                resized_img = img.resize((size, size), Image.Resampling.LANCZOS)
                
                # 保存图标
                output_path = os.path.join(output_dir, f'icon-{size}x{size}.png')
                resized_img.save(output_path, 'PNG', optimize=True)
                
                print(f"✓ 生成图标: {output_path} ({size}x{size})")
            
            print(f"\n成功生成 {len(sizes)} 个图标!")
            print(f"输出目录: {os.path.abspath(output_dir)}")
            
    except FileNotFoundError:
        print(f"错误: 找不到源图标文件 '{input_path}'")
        print("请确保 icon.png 文件存在于项目根目录")
    except Exception as e:
        print(f"错误: {str(e)}")


def main():
    """
    主函数 - 执行图标生成
    """
    # 配置路径
    script_dir = os.path.dirname(os.path.abspath(__file__))
    input_icon = os.path.join(script_dir, 'icon.png')
    output_directory = os.path.join(script_dir, 'public', 'icons')
    
    print("=" * 50)
    print("PWA 图标生成器")
    print("=" * 50)
    print(f"源图标: {input_icon}")
    print(f"输出目录: {output_directory}")
    print("=" * 50)
    print()
    
    # 检查 Pillow 库是否安装
    try:
        from PIL import Image
    except ImportError:
        print("错误: 未安装 Pillow 库")
        print("请运行: pip install Pillow")
        return
    
    # 生成图标
    generate_icons(input_icon, output_directory)


if __name__ == '__main__':
    main()
